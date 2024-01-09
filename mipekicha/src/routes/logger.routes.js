import express from 'express'
import { getLogs } from '../dao/controllers/logger.controller.js'

const router = express.Router()

router.get('/', getLogs)

export default router