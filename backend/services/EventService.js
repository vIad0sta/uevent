const {Event, EventFormats, EventThemes, Ticket, User, EventAttendees} = require('../models');
const EventDTO = require("../dto/EventDTO");
const { Op } = require("sequelize");
const UserDTO = require("../dto/UserDTO");

class EventService {
    async addEvent(event) {
        return new EventDTO(await Event.create(event))
    }
    async getEvent(eventId) {
        return new EventDTO(await Event.findByPk(eventId))
    }

    async updateEvent(event) {
        return new EventDTO(await Event.update(event, {
            where: {id: event.id}
        }))
    }

    async  getEvents(query) {
        const offset = (query.page - 1) * query.pageSize;
        const limit = parseInt(query.pageSize);
        let whereClause = {};
        let order = [];

        if (query.sortOption && query.sortOption !== 'none') {
            order.push([query.sortOption, query.sortDirection]);
        }

        if (query.filterThemes || query.filterFormats) {
            const filterTopicsArray = query.filterThemes ? query.filterThemes.split(',') : [];
            const filterFormatArray = query.filterFormats ? query.filterFormats.split(',') : [];
            const conditions = [];

            if (filterTopicsArray.length > 0) {
                conditions.push({ [Op.or]: filterTopicsArray.map(topic => ({ EventThemeId: topic })) });
            }

            if (filterFormatArray.length > 0) {
                conditions.push({ [Op.or]: filterFormatArray.map(format => ({ EventFormatId: format })) });
            }
            whereClause = { [Op.and]: conditions };
        }

        let response = await Event.findAndCountAll({
            limit,
            offset,
            where: whereClause,
            order: order
        });

        if (!response) {
            return;
        }

        return { events: response.rows.map(event => new EventDTO(event)), eventsCount: response.count };
    }

    async getEventsByCompany(companyId) {
        let limit = 6, offset = 0;
        let events = await Event.findAll({
                where: {CompanyId : companyId},
            limit,
            offset
            }
        )
        return events.map(event => new EventDTO(event))
    }
    async getEventsByUser(userId) {
        let events = await EventAttendees.findAll({
            where: { UserId: userId },
            include: [{
                model: Ticket,
                include: [{
                    model: Event,
                }]
            }]
        })
        return events.map(event => new EventDTO(event.Ticket.Event))
    }
    async getEventAttendees(eventId) {
        const tickets = await Ticket.findAll({
            where: { EventId: eventId }
        });

        const ticketIds = tickets.map(ticket => ticket.id);

        const eventAttendees = await EventAttendees.findAll({
            where: {
                TicketId: ticketIds,
                visible: true
            },
            include: [{
                model: User
            }]
        });
        return eventAttendees.map(element => new UserDTO(element.User))
    }
    async getSimilarEvents(theme) {
        let limit = 6, offset = 0;
        let events = await Event.findAll({
            where: {EventThemeId: theme},
            limit,
            offset
        })
        return events.map(event => new EventDTO(event))
    }
    async getEventFormats() {
        let eventFormats = await EventFormats.findAll();
        if (!eventFormats)
            return;
        return eventFormats
    }
    async getEventThemes() {
        let eventThemes = await EventThemes.findAll();
        if (!eventThemes)
            return;
        return eventThemes
    }
    async addTicket(ticket) {
        return new EventDTO(await Ticket.create(ticket))
    }
    async getTickets(eventId) {
        let tickets = await Ticket.findAll({
            where: { EventId : eventId}
        });
        if (!tickets)
            return;
        return tickets
    }
}


module.exports = new EventService();