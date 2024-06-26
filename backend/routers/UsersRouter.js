const express = require('express');
const usersRouter = express.Router();
const userController = require('../controllers/userController');
const jwtGenerator = require('../security/JwtGenerator')
const errorHandler = require("../ErrorHandler");



usersRouter.get('/', jwtGenerator.verifyToken, userController.getUser);
usersRouter.get('/cart', jwtGenerator.verifyToken, userController.getCart);
usersRouter.get('/tickets', jwtGenerator.verifyToken, userController.getTickets);
usersRouter.get('/company-subscription/:companyId', jwtGenerator.verifyToken, userController.getCompanySubscription);
usersRouter.get('/events', jwtGenerator.verifyToken, userController.getEvents);
usersRouter.patch('/tickets/:id', jwtGenerator.verifyToken, userController.updateBoughtTicket);
usersRouter.patch('/avatar', jwtGenerator.verifyToken, userController.updateUserAvatar);
usersRouter.patch('/', jwtGenerator.verifyToken, userController.updateUser);
usersRouter.delete('/', jwtGenerator.verifyToken, userController.deleteUser);
usersRouter.post('/company', jwtGenerator.verifyToken, userController.subscribeToCompany);
usersRouter.post('/send-restore-email', userController.sendRestoreEmail);
usersRouter.patch('/update-password',jwtGenerator.verifyResetToken, userController.updateUserPassword);
usersRouter.use((err, req, res, next) => errorHandler(err, req, res, next));
module.exports = usersRouter;