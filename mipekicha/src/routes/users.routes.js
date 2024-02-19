import { Router } from 'express'
import { changeUserRole } from '../dao/controllers/user.controller.js'

const route = Router()

route.put('/:uid', changeUserRole)

export default route