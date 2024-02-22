import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import userModel from '../dao/mongo/models/user.model.js'
import { createHash, isValidPassword } from '../utils.js'
import { config } from 'dotenv'
import { logger } from '../middlewares/logger.js'
config()

const localStrategy = local.Strategy
const initializePassport = () => {

    passport.use('registerPassport', new localStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        logger.debug(`My Body -> ${req.body}`)
        const { first_name, last_name, email, age } = req.body
        try {
            const user = await userModel.findOne({ email: username })
            if (user) {
                logger.info('User Already Exist')
                return done(null, false)
            }

            const newUser = {
                first_name,
                last_name,
                age,
                email,
                password: createHash(password)
            }

            const result = await userModel.create(newUser)
            return done(null, result)
        } catch (err) {
            return done(err)
        }
    }))

    passport.use('localPassport', new localStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })
            if (!user) {
                logger.info('User does not exists')
                return done(null, false)
            }

            if (!isValidPassword(user, password)) return done(null, false)

            let currentDateTime = new Date()

            await userModel.findOneAndUpdate({ email: username }, { last_connection: currentDateTime })

            return done(null, user)
        } catch (err) {
            return done(err)
        }
    }))

    passport.use('github', new GitHubStrategy(
        {
            clientID: process.env.PASS_CLIENT_ID,
            clientSecret: process.env.PASS_CLIENT_SECRET,
            callbackURL: process.env.PASS_CALLBACK_URL

        },
        async (accessToken, refreshToken, profile, done) => {
            logger.debug(profile)

            try {
                const user = await userModel.findOne({ email: profile._json.email })
                if (user) {
                    logger.info('User already exists')
                    return done(null, user)
                }

                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    password: ''
                }

                const result = await userModel.create(newUser)

                return done(null, result)
            } catch (error) {
                return done('Error tologin with github ' + error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id) // taking only the ID from the user
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport
