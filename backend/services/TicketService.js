const {Ticket, EventAttendees, Event} = require('../models');
class TicketService{
    async getTicketsByUser(userId){
        return await EventAttendees.findAll({
            where: {UserId: userId},
            include: [{
                model: Ticket
            }]
        })
    }
    async getTicket(ticketId){
        return await Ticket.findOne({
            where: {id: ticketId}
        })
    }
}
module.exports = new TicketService();