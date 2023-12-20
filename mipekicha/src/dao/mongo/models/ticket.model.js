import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const ticketCollection = 'tickets'

const ticketsSchema = new mongoose.Schema({
    code: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: null
    },
    amount: Number,
    purchaser: {
        type: String,
        required: true
    }
})

ticketsSchema.plugin(mongoosePaginate)

const ticketModel = mongoose.model(ticketCollection, ticketsSchema)

export default ticketModel
