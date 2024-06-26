const { transporter } = require("../utils/emailUtils");
const QRCode = require('qrcode');
const fs = require("fs");
const eventAttendeeService = require("../services/EventAttendeeService");
const cartService = require("../services/CartService");
const emailService = require("../services/EmailService");
const eventService = require("../services/EventService");
const ticketService = require("../services/TicketService");
const companyService = require("../services/CompanyService");
const userService = require("../services/UserService");
const path = require("path");

class TicketController {
    async createAndSendTicket(req, res, next) {
        try {
            const cartTickets = await cartService.getCartTickets(req.params.cartId);
            let qrCodeData = 'ticket';


            cartTickets.forEach(ticket => {
                qrCodeData = `${req.body.firstName}.${req.body.lastName}.${ticket.id}\n`;
            });
            const qrCodeImg = await QRCode.toDataURL(qrCodeData);

            const qrCodeImgBuffer = await QRCode.toBuffer(qrCodeData);

            const emailHtml = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Event Ticket</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                        }
                        .container {
                            max-width: 600px;
                            margin: 20px auto;
                            padding: 20px;
                            background-color: #fff;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            text-align: center;
                            color: #333;
                        }
                        .ticket-info {
                            text-align: center;
                            margin-top: 20px;
                        }
                        .qr-code {
                            display: block;
                            margin: 20px auto 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Event Ticket</h1>
                        <div class="ticket-info">
                            <p>Dear <strong>${req.body.firstName}</strong>,</p>
                            <p>Here is your ticket for the event!</p>
                            <img class="qr-code" src="${qrCodeImg}" alt="QR Code">
                        </div>
                    </div>
                </body>
                </html>
            `;

            await transporter.sendMail({
                from: 't28340990@gmail.com',
                to: req.body.email,
                subject: 'Event Ticket',
                html: emailHtml,
                attachments: [
                    {
                        filename: 'qrCode.png',
                        content: qrCodeImgBuffer
                    }
                ]

            });
            await emailService.setEventNotifications(req)
            await res.status(200).send('Ticket email sent successfully');
        } catch (e) {
            next(e);
        }
    }
    async saveBoughtTickets(req, res, next){
        try{
            const user = await userService.getUserById(req.user.id);
            const cartTickets = await cartService.getCartTickets(req.params.cartId);
            for (const item of cartTickets) {
                sendTicketNotifications(user, item);
                eventAttendeeService.saveEventAttendee(item.id,
                    {
                        quantity: item.CartTicket.quantity,
                        UserId: req.user.id,
                        visible: req.body.visible
                    })
            }
            await cartService.clearCart(req.params.cartId);
            return res.status(201).send();
        }
        catch (e) {
            next(e)
        }
    }
}
async function sendTicketNotifications(user, item) {
    const ticket = await ticketService.getTicket(item.id);
    const event = await eventService.getEvent(ticket.EventId);
    const company = await companyService.getCompany(event.CompanyId);
    transporter.sendMail({
        from: 't28340990@gmail.com',
        to: company.email,
        subject: 'Ticket Notification',
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
    <p>${user.username}bought ticket for your event"${event.title}"</p>
    <p>Regards,<br>Your Application Team</p>
</body>
</html>`,
    });
}
module.exports = new TicketController();
