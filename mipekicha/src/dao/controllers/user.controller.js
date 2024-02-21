import { userService } from '../../services/index.js'

export const changeUserRole = async (req, res, next) => {

    try {
        const uid = req.params.uid
        const data = req.body

        const result = await userService.changeUserRole(uid, data)

        res.send({
            status: 'success',
            payload: result
        })

    } catch (error) {
        next(error)
    }
}

export const retrieveAllUsers = async (req, res, next) => {

    try {
        const result = await userService.retrieveAllUsers()

        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        next(error)
    }
}

export const retrieveUserById = async (req, res, next) => {

    try {
        const uid = req.params.uid
        const result = await userService.retrieveUserById(uid)

        res.send({
            status: 'success',
            payload: result
        })

    } catch (error) {
        next(error)
    }
}

export const retrieveUserByEmail = async (req, res, next) => {

    try {
        const email = req.params.email
        const result = await userService.retrieveUserByEmail(email)

        res.send({
            status: 'success',
            payload: result
        })
    } catch (error) {
        next(error)
    }
}