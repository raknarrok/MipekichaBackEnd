import Router from 'express'
import { addMailTracker, verifyToken } from '../dao/controllers/mailTracker.controller.js'

const router = Router()

router.post('/', async (req, res) => {

    await addMailTracker(req)
    res.redirect('/token')
})

export default router