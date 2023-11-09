import { Router } from 'express'
import userModel from '../models/user.model.js'

const router = Router()

router.post('/singup', async (req, res) => {
    const user = req.body
    await userModel.create(user)
    res.redirect('/login')
})

router.post('/login', async (req, res) => {

    const { email, password } = req.body
    const user = await userModel.findOne({ email, password })
    if(!user) return res.redirect('/login')

    req.session.user = user

    res.redirect('/products')
})

router.get('/logout', async(req, res) => {
    req.session.destroy(err => {
        if(err) return res.send('Logout error')

        res.redirect('/login')
    })
})

export default router