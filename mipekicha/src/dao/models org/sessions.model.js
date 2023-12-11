import mongoose from 'mongoose'

const sessionCollection = 'sessions'

const sessionSchema = new mongoose.Schema({
    session: {
        cookie: {
            originalMaxAge: Number,
            expires: Date,
            httpOnly: Boolean,
            path: String
        },
        passport: {
            user: String
        }
    }
})

const sessionModel = mongoose.model(sessionCollection, sessionSchema)

export default sessionModel