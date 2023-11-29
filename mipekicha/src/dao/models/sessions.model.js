import mongose from 'mongoose'

const sessionCollection = 'sessions'

const sessionSchema = new mongose.Schema({
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

const sessionModel = mongose.model(sessionCollection, sessionSchema)

export default sessionModel