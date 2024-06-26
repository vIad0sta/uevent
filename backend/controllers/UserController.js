const userService = require('../services/UserService')
const ticketService = require('../services/TicketService')
const eventService = require("../services/EventService");
const cartService = require("../services/CartService");
const fs = require("fs");
const {transporter} = require("../utils/emailUtils");
const jwtGenerator = require('../security/JwtGenerator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserController {
    async getUser(req, res, next){
        try{
            let user = await userService.getUserById(req.user.id);
            return res.status(200).json(user);
        }
        catch(e){
            next(e);
        }
    }
    async getCompanySubscription(req, res, next){
        try{
            let companySubscription = await userService.getCompanySubscription(req.user.id, req.params.companyId);
            return res.status(200).json(companySubscription);
        }
        catch(e){
            next(e);
        }
    }
    async getTickets(req, res, next){
        try{
            let tickets = await ticketService.getTicketsByUser(req.user.id);
            return res.status(200).json({tickets: tickets});
        }
        catch(e){
            next(e);
        }
    }
    async getEvents(req, res, next){
        try{
            let events = await eventService.getEventsByUser(req.user.id);
            return res.status(200).json({eventsArray: events});
        }
        catch(e){
            next(e);
        }
    }
    async getCart(req, res, next){
        try{
            let cart = await cartService.getCartByUser(req.user.id);
            return res.status(200).json(cart);
        }
        catch(e){
            next(e);
        }
    }
    async updateBoughtTicket(req, res, next) {
        try{
            await userService.updateBoughtTicket(req.params.id, req.body.visible)
            return res.status(200).send();
        }
        catch (e) {
            next(e);
        }
    }
    async updateUser(req, res, next) {
        try{
            await userService.updateUser(req.user.id, req.body)
            return res.status(204).send();
        }
        catch (e) {
            next(e);
        }
    }
    async updateUserPassword(req, res, next) {
        try{
            let salt = await bcrypt.genSalt(saltRounds);
            req.body.password = await bcrypt.hash(req.body.password, salt);
            const user = await userService.getUserByEmail(req.body.email);
            await userService.updateUserPassword(user.id, req.body.password);
            await transporter.sendMail({
                from: 't28340990@gmail.com',
                to: user.email,
                subject: 'Restore password email',
                html: `

    <html lang="en">
<head>
<style>
        a:hover {
            color: #ff7f50;
        }
    </style>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restore Password Notification</title>
</head>
<body>
    <p>Hello,</p>
    <p>Your password was restored successfully.</p>
    <p>Regards,<br>Your Application Team</p>
</body>
</html>`,
            });
            return res.status(200).send();
        }
        catch (e) {
            next(e);
        }
    }
    async deleteUser(req, res, next){
        try{
            await userService.deleteUser(req.user.id);
            return res.status(200).json({message: "successful"});
        }
        catch(e){
            next(e);
        }
    }
    async subscribeToCompany(req, res, next){
        try{
            let result = req.body.checked ? await userService.subscribeToCompany(req.user, req.body.companyId) : await userService.unsubscribeFromCompany(req.body.id);
            console.log(result)
            return res.status(200).send({data: result});
        }
        catch(e){
            next(e);
        }
    }
    async updateUserAvatar(req, res, next) {
        try {
            const savePath = './static/images/' + req.files.photo.name;
            await userService.updateAvatar(req.user.id, `/static/images/${req.files.photo.name}`);
            fs.writeFile(savePath, req.files.photo.data, 'binary', (err) => {
                if (err) {
                    next(err);
                }
            });
            return res.status(200).json({message: "successful"});
        } catch (e) {
            next(e);
        }
    }
    async sendRestoreEmail(req,res,next){
        try {
            const cookieValue = jwtGenerator.generateToken(req.body.email,0,'5m')
            res.cookie('resetToken', cookieValue, { maxAge: 900000, httpOnly: true });
            res.send('Cookie set successfully!');
            await transporter.sendMail({
                from: 't28340990@gmail.com',
                to: req.body.email,
                subject: 'Restore password email',
                html: `

    <html lang="en">
<head>
<style>
        a:hover {
            color: #ff7f50;
        }
    </style>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restore Password Email</title>
</head>
<body>
    <p>Hello,</p>
    <p>You have requested to restore your password. Please click the link below to proceed:</p>
    <p><a href="http://localhost:3000/restore-password/new-password?email=${req.body.email}" style="display: inline-block; padding: 10px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; transition: color 0.3s;">Restore Password</a></p>
    <p>If you did not request this, please ignore this email.</p>
    <p>Regards,<br>Your Application Team</p>
</body>
</html>`,
            });
        }catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController();