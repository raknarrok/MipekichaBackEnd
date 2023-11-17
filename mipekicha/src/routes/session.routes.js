import { Router } from 'express'
import passport from 'passport'
import userModel from '../models/user.model.js'
import { isValidPassword } from '../utils.js'

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

// Midleware implementation
router.post('/singup', passport.authenticate('registerPassport', {
    failureRedirect: '/register',
}), async (req, res) => {
    res.redirect('/login')
})

router.get('/register', (req, res) => res.send({ error: 'Failed' }))

router.post('/login', passport.authenticate('localPassport', {
    failureRedirect: '/login'
}), async (req, res) => {

    if (!req.user) {
        return res.status(400).send({ status: 'Error', error: 'Invalid credentials' })
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age
    }

    res.redirect('/products')
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            res.status(500).render('errors/base', { error: err })
        } else res.redirect('/login')
    })
})

export default router