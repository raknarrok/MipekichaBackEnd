import MailTrackerModel from '../mongo/models/mailTracker.model.js'
import userModel from '../mongo/models/user.model.js'
import CustomError from '../../services/errors/custom_errors.js'
import { generateMailTrackerErrorInfo } from '../../services/errors/info.js'
import { createHash, isValidPassword } from '../../utils.js'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { config } from 'dotenv'
config()

class mailTracker {
    createMailTracker = async ({
        email
    }) => {
        try {
            const mailTracker = {
                to: email,
            }

            const isExistingUser = await userModel.exists({ email: mailTracker.to })

            if (!isExistingUser) {
                return 'Email Not Registered'
            }

            if (
                !mailTracker?.to
            ) {
                CustomError.createError({
                    name: 'Error',
                    cause: generateMailTrackerErrorInfo(mailTracker),
                    message: 'Error trying to send mail.',
                })
            }

            const token = crypto.randomBytes(5).toString('hex')
            mailTracker.token = token

            await MailTrackerModel.create(mailTracker)

            const transport = nodemailer.createTransport({
                service: process.env.TWILIO_MAIL_SERVICE,
                port: 587,
                auth: {
                    user: process.env.TWILIO_MAIL_ACCOUNT,
                    pass: process.env.TWILIO_MAIL_PASSWORD
                }
            })

            // Check how we can keep the solid principle here
            const resultTransporter = await transport.sendMail({
                from: process.env.TWILIO_MAIL_ACCOUNT,
                to: mailTracker.to,
                subject: 'Recuperar Contraseña',
                html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
    <h1 style="color: #007bff;">Valido para restablecer</h1>
    <p>Al dar clickl en el siguiente link ingresa siguiente token <b>[${token}]</b> para restaurar tu contraseña</p>
    <p>Tiene Una expiración de 1 hora.</p>

    <a href="http://localhost:8080/token" style="display: inline-block; margin: 10px 0; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
     Click aquí para cambiar la contraseña
    </a>

    <p>En caso de expirar, ve al siguiente enlace para crear una nueva petición.</p>

    <a href="http://localhost:8080/restore-password" style="display: inline-block; margin: 10px 0; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">
    Click aquí para crear una nueva petición
    </a>
</div>
<b>En caso de que no hayas solicitado un cambio de contraseña, ignora este correo.</b>`,
                attachments: []
            })

            return token

        } catch (error) {
            console.error(error)
            throw error
        }
    }

    verifyToken = async (token) => {
        try {
            const mailTracker = await MailTrackerModel.findOne({ token: token })

            if (!mailTracker) {
                return 'Invalid Token'
            }

            return mailTracker.to
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    verifyPassword = async ({ email, password }) => {

        const userDetails = await userModel.findOne({ email: email })

        // Verify if the password is the same as the one in the database
        if(isValidPassword(userDetails, password)) {
            return false
        }

        // If is different we save it and returns true
        userDetails.password = createHash(password)
        await userDetails.save()

        return true
    }
}

export default mailTracker