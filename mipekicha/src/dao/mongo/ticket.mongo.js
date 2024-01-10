import TicketModel from '../mongo/models/ticket.model.js'

class Ticket {

    // data will contain the products array and the total
    // As well the user email
    createTicket = async(data) => {

        // Generate the ticket code
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        let counter = 0
        let uniqueCode = ''

        do {
            uniqueCode = ''
            for (let i = 0; i < 6; i++) {
                uniqueCode += characters.charAt(Math.floor(Math.random() * characters.length))
            }
            counter++
        } while (await TicketModel.exists({ code: uniqueCode }) || counter <= 3)

        const ticket = {
            code: uniqueCode.toString(),
            createdAt: new Date(),
            products: data.products,
            amount: data.total,
            purchaser: data.email
        }
        return await TicketModel.create(ticket)
    }

    updateTicket = async(tid, data) => {
        if (!data) {
            throw new Error('BAD REQUEST: Hey!!! You are missing one or more required fields. Please provide values for products, total or purchaser to continue.')
        }

        return await TicketModel.findByIdAndUpdate(tid, data, { new: true })
    }

    deleteTicketById = async (tid) => {
        return await ProductModel.findByIdAndDelete({ _id: tid })
    }

    getAllTickets = async () => {
        return await TicketModel.find().lean().exec()
    }

    getTicketsByEmail = async (email) => {
        return await TicketModel.find({ purchaser: email }).lean().exec()
    }

    getTicketById = async (tid) => {
        return await TicketModel.findById(tid).lean().exec()
    }
}

export default Ticket
