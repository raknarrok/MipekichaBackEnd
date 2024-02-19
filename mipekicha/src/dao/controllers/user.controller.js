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