class TicketRepository {

    constructor(dao){
        this.dao = dao
    }

    addTicket = async (data) => { return await this.dao.createTicket(data) }
    updateTicket = async (tid, data) => { return await this.dao.updateTicket(tid, data) }
    removeTicketById = async (tid) => { return await this.dao.deleteTicketById(tid) }
    retrieveAllTickets = async () => { return await this.dao.getAllTickets() }
    retrieveTicketByeEmail = async (email) => { return await this.dao.getTicketsByEmail(email) }
    retrieveTicketById = async (tid) => { return await this.dao.getTicketById(tid) }
}

export default TicketRepository