const eventService = require("../services/EventService");
const companyService = require("../services/CompanyService");
const commentService = require("../services/CommentService");
const userService = require("../services/UserService");
const fs = require("fs");
const {transporter} = require("../utils/emailUtils");

class EventController{
    async addEvent(req, res, next){
        try{
            let result = await eventService.addEvent(req.body);
            sendNotifications(req, result);
            return res.status(201).json({id: result});
        }
        catch(e){
            next(e);
        }
    }
    async getEvent(req,res,next) {
        try{
            const event = await eventService.getEvent(req.params.id)
            return res.status(200).json(event)
        }
        catch (e) {
            next(e)
        }
    }
    async getEvents(req, res, next) {
        try {
            const response = await eventService.getEvents(req.query);
            return res.status(200).json({
                events: response.events,
                eventsCount: response.eventsCount
            });
        } catch (e) {
            next(e);
        }
    }
    async getEventAttendees(req, res, next) {
        try {
            const response = await eventService.getEventAttendees(req.params.eventId);
            return res.status(200).json({
                eventAttendees: response,
            });
        } catch (e) {
            next(e);
        }
    }
    async getEventsByCompany(req,res,next) {
        try {
            const events = await eventService.getEventsByCompany(req.params.id)
            return res.status(200).json(events)
        } catch (e) {
            next(e)
        }
    }
    async getSimilarEvents(req,res,next) {
        try {
            const events = await eventService.getSimilarEvents(req.params.theme)
            return res.status(200).json(events)
        } catch (e) {
            next(e)
        }
    }

    async updateEventById(req, res, next){
        try{
            await eventService.updateEvent(req.body);
            return res.status(200).json({message: "successful"});
        }
        catch (e) {
            next(e);
        }
    }
    async getEventFormats(req, res, next){
        try{
            const eventFormats = await eventService.getEventFormats();
            return res.status(200).json({formats: eventFormats});
        }
        catch (e){
            next(e);
        }
    }

    async getEventThemes(req, res, next){
        try{
            const eventThemes = await eventService.getEventThemes();
            return res.status(200).json({themes: eventThemes});
        }
        catch (e){
            next(e);
        }
    }
    async addTicket(req, res, next){
        try{
            let result = await eventService.addTicket(req.body);
            return res.status(201).json({id: result});
        }
        catch(e){
            next(e);
        }
    }
    async getTickets(req,res,next) {
        try{
            const event = await eventService.getTickets(req.params.id)
            return res.status(200).json(event)
        }
        catch (e) {
            next(e)
        }
    }

    async addComment(req, res, next){
        try{
            let comment = await commentService.addComment(req.body, req.user.id);
            return res.status(201).json(comment);
        }
        catch (e) {
            next(e)
        }
    }
    async getCommentsByEvent(req, res, next){
        try{
            let comments = await commentService.getCommentsByEvent(req.params.eventId, req.query);
            return res.status(200).json(comments);
        }
        catch (e) {
            next(e)
        }
    }
    async savePoster(req, res, next) {
        try {
            const savePath = './static/images/' + req.files.photo.name;
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

}

async function sendNotifications(req, event){
    try{
        const company = await companyService.getCompany(req.body.CompanyId);
        let subscriptions = await userService.getCompanySubscriptions(req.body.CompanyId);
        for (const item of subscriptions) {
            let user = await userService.getUserById(item.UserId);
            await transporter.sendMail({
                from: 't28340990@gmail.com',
                to: user.email,
                subject: 'Event creation',
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
    <title>Notification</title>
</head>
<body>
    <p>Hello,</p>
    <p>${company.name} created new event "${event.title}"</p>
    <p><a href="http://localhost:3000/events/${event.id}" style="display: inline-block; padding: 10px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; transition: color 0.3s;">Here is link</a></p>
    <p>Regards,<br>Your Application Team</p>
</body>
</html>`,
            });
        }
    }
    catch (e) {
        console.log(e)
    }

}
module.exports = new EventController();