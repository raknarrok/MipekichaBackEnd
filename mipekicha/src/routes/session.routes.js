import { Router } from 'express'
import passport from 'passport'
import userModel from '../models/user.model.js'

const router = Router()

router.get(
    'login-github',
    passport.authenticate('github', { scope: ['profile', 'email'] }),
    async (req, res) => { }
)

router.get(
    '/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }),
    async (req, res) => {
        console.log('Callback', req.user)
        req.session.user = req.user

        console.log(req.session)
        res.redirect('/')
    })

router.get('/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send('Logout error')

        res.redirect('/login')
    })
})

router.post('/singup', async (req, res) => {
    const user = req.body
    await userModel.create(user)
    res.redirect('/login')
})

router.post('/login', async (req, res) => {

    const { email, password } = req.body
    const user = await userModel.findOne({ email, password })
    if (!user) return res.redirect('/login')

    req.session.user = user

    res.redirect('/products')
})

export default router