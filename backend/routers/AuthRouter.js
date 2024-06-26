const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/AuthController');
const errorHandler = require("../ErrorHandler");
const jwtGenerator = require('../security/JwtGenerator')

authRouter.post('/registration', authController.registration);
authRouter.post('/login', authController.login);
authRouter.post('/logout',jwtGenerator.verifyToken, authController.logout);

authRouter.post('/refresh-access', jwtGenerator.verifyRefreshToken ,authController.refreshAccessToken);

authRouter.post('/login/getVerificationCode', authController.getVerificationCodeByEmail);
authRouter.post('/login/sendVerificationCode', authController.checkVerificationCode);
authRouter.post('/login/sendEmailVerificationCode',jwtGenerator.verifyToken, authController.checkEmailVerificationCode);

authRouter.use((err, req, res, next) => errorHandler(err, req, res, next));

module.exports = authRouter;