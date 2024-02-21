import { Router } from 'express'
import { changeUserRole, retrieveAllUsers, retrieveUserById, retrieveUserByEmail } from '../dao/controllers/user.controller.js'

const route = Router()

route.put('/:uid', changeUserRole)
route.put('/premium/:uid', changeUserRole)
route.get('/', retrieveAllUsers)
route.get('/:uid', retrieveUserById)
route.get('/email/:email', retrieveUserByEmail)

export default route