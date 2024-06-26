const express = require('express');
const eventRouter = express.Router();
const eventController = require('../controllers/EventController');
const jwtGenerator = require("../security/JwtGenerator");
const errorHandler = require("../ErrorHandler");
const checkOwner = require('../utils/companyUtils')

eventRouter.get('/themes', eventController.getEventThemes);
eventRouter.get('/:eventId/comments', eventController.getCommentsByEvent);
eventRouter.get('/:eventId/attendees', eventController.getEventAttendees);
eventRouter.get('/formats', eventController.getEventFormats);
eventRouter.get('/:id/tickets', eventController.getTickets);
eventRouter.get('/:id', eventController.getEvent)
eventRouter.get('/company/:id', eventController.getEventsByCompany)
eventRouter.get('/company/similarEvents/:theme', eventController.getSimilarEvents)
eventRouter.get('/', eventController.getEvents);
eventRouter.post('/', jwtGenerator.verifyToken, checkOwner, eventController.addEvent);
eventRouter.post('/poster', jwtGenerator.verifyToken, eventController.savePoster);
eventRouter.post('/tickets', jwtGenerator.verifyToken, checkOwner, eventController.addTicket);
eventRouter.post('/:eventId/comments',  jwtGenerator.verifyToken, eventController.addComment);
eventRouter.patch('/:eventId',  jwtGenerator.verifyToken, eventController.updateEventById);

eventRouter.use((err, req, res, next) => errorHandler(err, req, res, next));
module.exports = eventRouter;
