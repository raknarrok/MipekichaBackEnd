import UserModel from '../mongo/models/user.model.js'
import CustomError from '../../services/errors/custom_errors.js'
import { generateEmptyError } from '../../services/errors/info.js'
import EErrors from '../../services/errors/enums.js'

class User {
    //CRUD - Create Read Update Delete
    // CREATE USER IS IN THE AUTH SERVICE
    updateUserRole = async (uid, data) => {
        try {
            if (!data) {
                CustomError.createError({
                    name: 'Error',
                    cause: generateEmptyError(uid, data),
                    message: 'Error trying to update user.',
                    code: EErrors.DATA_PROVIDED_ERROR
                })
            }

            const updatedUser = await UserModel.findByIdAndUpdate(
                uid,
                data,
                { new: true }
            )

            return updatedUser

        } catch (error) {
            console.error(error)
        }
    }
}

export default User