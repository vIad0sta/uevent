const express = require('express');
const ticketRouter = express.Router();
const ticketController = require('../controllers/ticketController');
const errorHandler = require("../ErrorHandler");
const jwtGenerator = require("../security/JwtGenerator");

ticketRouter.post('/buy-ticket/:cartId', jwtGenerator.verifyToken, ticketController.createAndSendTicket);
ticketRouter.post('/cart/:cartId', jwtGenerator.verifyToken, ticketController.saveBoughtTickets);
ticketRouter.use((err, req, res, next) => errorHandler(err, req, res, next));

module.exports = ticketRouter;