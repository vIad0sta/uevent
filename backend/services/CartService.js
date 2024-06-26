const {Cart, CartTicket, Ticket, Event} = require('../models');

class CartService {
    async addCart(cart) {
        return await Cart.create(cart);
    }
    async addCartTicket(cartTicket) {
        return await CartTicket.create(cartTicket);
    }
    async updateCartTicket(cartTicket, cartId, ticketId) {
        return await CartTicket.update(cartTicket, {
            where: {
                CartId: cartId,
                TicketId: ticketId
            }
        });
    }
    async getCart(cartId) {
        return await Cart.findOne({
            where: {
                id: cartId
            },
            include: [
                {
                    model: Ticket,
                    through: {
                        attributes: []
                    }
                }
            ]
        });
    }
    async getCartTickets(cartId) {
        const cart = await Cart.findByPk(cartId, {
            include: [{
                model: Ticket,
                through: { attributes: ['quantity'] }
            }]
        });

        return cart.Tickets;
    }
    async getCartTicketsAndEvents(cartId) {
        const cart = await Cart.findByPk(cartId, {
            include: [{
                model: Ticket,
                include: Event,
                through: { attributes: ['quantity'] }
            }]
        });

        return cart.Tickets;
    }
    async  getEventsWithTicketsInCart(cartId) {
        try {
            const cart = await Cart.findByPk(cartId, {
                include: [{
                    model: Ticket,
                    include: [Event]
                }]
            });

            const eventIds = cart.Tickets.map(ticket => ticket.Event.id);

            return await Event.findAll({
                where: { id: eventIds },
                order: [['startTime', 'ASC']]
            });
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
    async updateCart(cart) {
        return await Cart.update(cart, {
            where: {id: cart.id}
        });
    }
    async getCartByUser(userId) {
        return await Cart.findOne({
            where: {
                UserId: userId
            },
            include: [
                {
                    model: Ticket,
                    through: {
                        attributes: ['quantity']
                    }
                }
            ]
        })
    }
    async deleteCart(cartId) {
        await Cart.destroy({
            where: {
                id: cartId
            }
        });
    }
    async deleteCartTicket(cartId, ticketId) {
        await CartTicket.destroy({
            where: {
                CartId: cartId,
                TicketId: ticketId
            }
        });
    }
    async clearCart(cartId) {
        await CartTicket.destroy({
            where: {
                CartId: cartId
            }
        });
    }
}

module.exports = new CartService()