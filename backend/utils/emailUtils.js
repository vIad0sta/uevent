const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 't28340990@gmail.com',
        pass: 'xnxi xjyl mtap pjlq',
    }
})

module.exports = {transporter};