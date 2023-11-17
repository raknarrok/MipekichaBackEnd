import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import userModel from '../models/user.model.js'
import { createHash, isValidPassword } from '../utils.js'
import { config } from 'dotenv'
config()

const localStrategy = local.Strategy
const initializePassport = () => {

    passport.use('registerPassport', new localStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, username, password, done) => {
        console.log('My Body ->', req.body)
        const { first_name, last_name, email, age } = req.body
        try {
            const user = await userModel.findOne({ email: username })
            if (user) {
                console.log('User Already Exist')
                return done(null, false)
            }

            const newUser = {
                first_name,
                last_name,
                age,
                email,
                password: createHash(password)
            }

            const result = await userModel.create(newUser)
            return done(null, result)
        } catch (err) {
            return done(err)
        }
    }))

    passport.use('localPassport', new localStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })
            if (!user) {
                console.log('User does not exists')
                return done(null, false)
            }

            if (!isValidPassword(user, password)) return done(null, false)

            return done(null, user)
        } catch (err) {
            return done(err)
         }
    }))

    passport.use('github', new GitHubStrategy(
        {
            clientID: process.env.PASS_CLIENT_ID,
            clientSecret: process.env.PASS_CLIENT_SECRET,
            callbackURL: process.env.PASS_CALLBACK_URL

        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile)

            try {
                const user = await userModel.findOne({ email: profile._json.email })
                if (user) {
                    console.log('User already exists')
                    return done(null, user)
                }

                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    password: ''
                }

                const result = await userModel.create(newUser)

                return done(null, result)
            } catch (error) {
                return done('Error tologin with github ' + error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id) // taking only the ID from the user
    })

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id)
        done(null, user)
    })
}

export default initializePassport
