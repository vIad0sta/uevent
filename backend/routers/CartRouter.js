const express = require('express');
const cartRouter = express.Router();
const cartController = require('../controllers/CartController');
const jwtGenerator = require("../security/JwtGenerator");
const errorHandler = require("../ErrorHandler");

cartRouter.get('/:cartId/tickets', jwtGenerator.verifyToken, cartController.getCartTickets);
cartRouter.get('/:cartId/tickets-events', jwtGenerator.verifyToken, cartController.getCartTicketsAndEvents);
cartRouter.get('/:cartId', jwtGenerator.verifyToken, cartController.getCart);
cartRouter.post('/:cartId/tickets', jwtGenerator.verifyToken, cartController.addCartTicket);
cartRouter.post('/', jwtGenerator.verifyToken, cartController.addCart);
cartRouter.patch('/:cartId/tickets/:ticketId', jwtGenerator.verifyToken, cartController.updateCartTicket);
cartRouter.patch('/', jwtGenerator.verifyToken, cartController.updateCart);
cartRouter.delete('/:cartId/tickets/:ticketId', jwtGenerator.verifyToken, cartController.deleteCartTicket);
cartRouter.delete('/:cartId/tickets', jwtGenerator.verifyToken, cartController.clearCart);
cartRouter.delete('/:cartId', jwtGenerator.verifyToken, cartController.deleteCart);
cartRouter.use((err, req, res, next) => errorHandler(err, req, res, next));
module.exports = cartRouter;