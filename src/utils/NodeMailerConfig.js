const nodemailer = require('nodemailer');

const env = require("dotenv");
env.config();

const initConfig = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_PASSWORD
        }
    });

// used to create object used to send emails
//     const sendEmailBuilder = ( userEmail, id ) => {
//     const sender = 

//     return sender;
// };

module.exports = { initConfig };