import { ticketService } from '../../services/index.js'
// TODO: Implement Try/Catch
export const addTicket = async (req, res) => {

    const data = req.body
    const result = await ticketService.addTicket(data)

    res.send({
        status: 'success',
        payload: result
    })
}

export const updateTicket = async (req, res) => {

    const tid = req.params.tid
    const data = req.body
    const result = await ticketService.updateTicket(tid, data)

    res.send({
        status: 'success',
        payload: result
    })
}

export const removeTicketById = async (req, res) => {

    const tid = req.params.tid
    const result = await ticketService.removeTicketById(tid)

    res.send({
        status: 'success',
        payload: result
    })
}

export const retrieveAllTickets = async (req, res) => {

    const result = await ticketService.retrieveAllTickets()

    res.send({
        status: 'success',
        payload: result
    })
}

export const retrieveTicketByeEmail = async (req, res) => {

    const email = req.params.email
    const result = await ticketService.retrieveTicketByeEmail(email)

    res.send({
        status: 'success',
        payload: result
    })
}

export const retrieveTicketById = async (req, res) => {

    const tid = req.params.tid
    const result = await ticketService.retrieveTicketById(tid)

    res.send({
        status: 'success',
        payload: result
    })
}