const util = require('util');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwtGenerator = require('../security/JwtGenerator');
const userService = require('../services/UserService')
const cartService = require('../services/CartService')
const totpGenerator = require('../security/TOTPGenerator')
const {transporter} = require("../utils/emailUtils");



class AuthController {

    async registration(req, res, next) {
        try {
            let salt = await bcrypt.genSalt(saltRounds);
            const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
            if (!passwordRegex.test(req.body.password)) {
                return res.status(400).json({ error: "Password does not meet requirements" });
            }
            req.body.password = await bcrypt.hash(req.body.password, salt);
            const user = await userService.addUser(req.body);
            await cartService.addCart({ UserId: user.id, price: 0 })
            return res.status(201).json(user);
        }
        catch(e){
            next(e);
        }
    }
    async refreshAccessToken(req, res, next) {
        try {
            jwtGenerator.setAccessTokenCookie(res, jwtGenerator.generateToken(req.user.id,  req.user.role,'5m'));
            const expiredAt = jwtGenerator.calculateExpiry(5, 'minutes');
            return res.status(200).json({expiredAt: expiredAt});
        }
        catch(e){
            next(e);
        }
    }
    async checkEmailVerificationCode(req,res,next) {
        const mfaSecret = await userService.getUserMfaSecretById(req.user.id);
        if (totpGenerator.verifyTOTP(req.body.code, mfaSecret)) {
            await userService.updateUser(req.user.id, {isEmailVerified: true})
            return res.status(200).json({message:'email verified'});
        }
    }

    async checkVerificationCode(req,res,next) {
        let user = await userService.getUserForLogin(req.body.username);
        if (totpGenerator.verifyTOTP(req.body.code, user.mfaSecret)) {
            const expiredAt = setCookies(req, res, user);
            return res.status(200).json({expiredAt: expiredAt});
        }
    }

        async getVerificationCodeByEmail(req,res,next) {
            let base32Encode;
            try {
                const module = await import('base32-encode');
                base32Encode = module.default;
            } catch (error) {
               throw new Error('Error loading base32-encode module:', error);
            }
            let user = await userService.getUserForLogin(req.body.username);
            if (!user.mfaSecret) {
                let buffer = await util.promisify(crypto.randomBytes)(14);
                user.mfaSecret = base32Encode(buffer, 'RFC4648', { padding: false });
                await userService.updateUser(user.id, {mfaSecret: user.mfaSecret})
                buffer = null;
            }
            const verCode = totpGenerator.generateTOTP(user.mfaSecret)

        await transporter.sendMail({
            from: 't28340990@gmail.com',
            to: user.email,
            subject: 'Verification code',
            html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verification Code</title>
        </head>
        <body>
            <h1>Verification Code</h1>
            <p>Dear ${user.username},</p>
            <p>Your verification code is: <strong>${verCode}</strong></p>
            <p>Please use this code to complete your login process.</p>
            <p>If you did not request this code, please ignore this email.</p>
            <p>Thank you.</p>
        </body>
        </html>
    `
        });
    }
    async login(req, res, next){
        try{
            let user = await userService.getUserForLogin(req.body.username);
            if (!user) throw new Error('Invalid login credentials!');

            const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);

            if (isPasswordMatch){
                if(user.isMfaEnabled) {
                    return res.status(403).end();
                }
                const expiredAt = setCookies(req, res, user);
                return res.status(200).json({expiredAt: expiredAt});
            }
            else throw new Error('Invalid login credentials!');
        }
        catch (e) {
            next(e);
        }
    }
    async logout(req, res, next) {
        try {
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken', { path: '/api/auth' });
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            next(error);
        }
    }
}

function setCookies(req, res, user){
    jwtGenerator.setAccessTokenCookie(res, jwtGenerator.generateToken(user.id, user.role, '5m'));
    const refreshToken = jwtGenerator.generateToken(user.id,  user.role,'7d');
    const expiredAt = jwtGenerator.calculateExpiry(5, 'minutes');
    jwtGenerator.setRefreshTokenCookie(res, refreshToken);
    return expiredAt;
}

module.exports = new AuthController();