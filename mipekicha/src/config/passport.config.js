import passport from 'passport'
import GitHubStrategy from 'passport-github2'
import userModel from '../models/user.model.js'

const initializePassport = () => {

    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.1196f299350759da',
            clientSecret: '345d777b63c9b66f1787b3acc6a9389f4aacbe66',
            callbackURL: 'http://localhost:8080/githubcallback'

        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile)

            try {
                const user = await userModel.findOne({ email: profile._json.email })
                if(user) {
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
                return done('Error tologin with github '+ error)
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
