const { transporter } = require("../utils/emailUtils");
const schedule = require('node-schedule');
const userService = require("../services/UserService");
const cartService = require("../services/CartService");
class EmailService {
    async setEventNotifications(req) {
        try {
            const user = await userService.getUserById(req.user.id);
            const events = await cartService.getEventsWithTicketsInCart(req.params.cartId);
            let dates = [];
            events.map((event) => {
                console.log(new Date(Date.parse(event.startTime) - 1000))
                dates.push({event: event, notificationDate: new Date(Date.parse(event.startTime) - 1000)})
                dates.push({event: event, notificationDate: new Date(Date.parse(event.startTime) - (60 * 1000))})
            });

            await Promise.all(dates.map(async (date) => {
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
                            .notification-info {
                                text-align: center;
                                margin-top: 20px;
                            }
                           
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Event Notitfication</h1>
                            <div class="notification-info">
                                <p>Dear <strong>${user.firstName}</strong>,</p>
                                <p>${date.event.title}'s coming soon!!!</p>
                                <p>Start time: ${date.event.startTime}</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `;

                schedule.scheduleJob(date.notificationDate, async () => {
                    try {
                        await transporter.sendMail({
                            from: 't28340990@gmail.com',
                            to: user.email,
                            subject: 'Event Notification',
                            html: emailHtml
                        });
                        console.log('Ticket email sent successfully');
                    } catch (error) {
                        console.error('Error sending ticket email:', error);
                    }
                });
            }));
        } catch (e) {
        }
    }
}
module.exports = new EmailService()