import { Router } from 'express'
import passport from 'passport'
import userModel from '../models/user.model.js'
import { createHash, isValidPassword } from '../utils.js'

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
    try {
        const newUser = req.body
        newUser.password = createHash(newUser.password)

        await userModel.create(newUser)
        res.redirect('/login')

    } catch (error) {
        // TODO: Create a view to show the error or popup
        console.log(error)
        res.status(500).send('Error to create user - please contact support')
    }
})

router.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).lean().exec();

        if (!user || !isValidPassword(user, password)) {
            throw new Error('Unauthorized')
        }

        req.session.user = user;

        res.redirect('/products')
    } catch (error) {
        console.error(error);

        if (error.message === 'Unauthorized') {
            return res.status(401).redirect('/login')
        }

        res.status(500).send('An error occurred while logging in')
    }
})

export default router