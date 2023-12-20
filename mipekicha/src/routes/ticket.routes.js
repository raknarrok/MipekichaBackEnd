import { Router } from 'express'
import { addTicket, updateTicket, removeTicketById, retrieveAllTickets, retrieveTicketById, retrieveTicketByeEmail } from '../dao/controllers/ticket.controller.js'

const route = Router()

route.post('/', addTicket)
route.put('/ticket/:tid', updateTicket)
route.delete('/ticket/:tid', removeTicketById)
route.get('/', retrieveAllTickets)
route.get('/ticket/:tid', retrieveTicketById)
route.get('/email/:email', retrieveTicketByeEmail)

export default route
