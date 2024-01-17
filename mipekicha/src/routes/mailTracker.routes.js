import Router from 'express'
import { addMailTracker } from '../dao/controllers/mailTracker.controller.js'

const router = Router()

router.post('/', async (req, res) => {

    await addMailTracker(req)
    res.redirect('/token')
})

router.post('/restore', async(req, res) => {

    await verifyToken(req)
    res.redirect('/update-password')
})

export default router