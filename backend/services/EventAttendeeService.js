const {Ticket, EventAttendees, Event} = require('../models');
class TicketService{
    async saveEventAttendee(ticketId, attendeeData){
        let eventAttendee = new EventAttendees(attendeeData);
        eventAttendee.TicketId = Number(ticketId);
        eventAttendee = await eventAttendee.save();
        return eventAttendee;
    }
}
module.exports = new TicketService();