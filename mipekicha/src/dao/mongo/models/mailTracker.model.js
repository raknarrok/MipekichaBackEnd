import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const mailTrackerCollection = 'mailTracker'

const mailTrackerSchema = new mongoose.Schema({
    to: {
        type: String,
        required: true
    },
    subject: String,
    token: {
        type: String,
        required: true
    },
    expiredTime: {
        type: Date,
        default: Date.now,
        expires: 60 * 2 // 2 minutes
        // expires: 60 * 60 // 1 hour
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    }
})

mailTrackerSchema.plugin(mongoosePaginate)

const mailTrackerModel = mongoose.model(mailTrackerCollection, mailTrackerSchema)

export default mailTrackerModel