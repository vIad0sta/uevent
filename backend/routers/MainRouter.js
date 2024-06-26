const express = require('express');
const mainRouter = express.Router();

const authRouter = require('./AuthRouter');
const usersRouter = require('./UsersRouter');
const eventsRouter = require('./EventsRouter');
const companiesRouter = require('./CompanyRouter')
const cartRouter = require('./CartRouter')
const commentRouter = require('./CommentRouter')
const ticketsRouter = require('./TicketRouter')
const paymentsRouter = require('./PaymentsRouter')
mainRouter.use('/auth', authRouter);
mainRouter.use('/users', usersRouter);
mainRouter.use('/events', eventsRouter);
mainRouter.use('/companies',companiesRouter)
mainRouter.use('/comments',commentRouter)
mainRouter.use('/tickets',ticketsRouter)
mainRouter.use('/payments',paymentsRouter)
mainRouter.use('/carts',cartRouter)

module.exports = mainRouter;