const express = require('express');
const paymentsRouter = express.Router();
const paymentsController = require('../controllers/PaymentController');
const errorHandler = require("../ErrorHandler");


paymentsRouter.post('/create-payment-intent', paymentsController.createPaymentIntent);
paymentsRouter.use((err, req, res, next) => errorHandler(err, req, res, next));

module.exports = paymentsRouter;