import { Router } from 'express'
import passport from 'passport'
import SessionManager from '../dao/mongoManager/SessionManager.js'

const sessionManager = new SessionManager()
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
        age: req.user.age,
        role: req.user.role,
        cart: req.user.cart
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

router.get('/current', async (req, res) => {
    try{
        const current = await sessionManager.getAllSessions()
        if( current.length === 0){
            res.status(404).send({ error: 'No hay sesiones activas' })
        } else {
            res.status(200).send({ current })
        }
    } catch (error) {
        res.status(500).send({ error: error.message })
    }
})

export default router