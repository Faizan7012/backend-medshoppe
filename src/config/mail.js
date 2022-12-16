const nodemailer = require('nodemailer');
const emailusername = 'medshoppe5@gmail.com';
const emailpassword = 'pyclktoirtmfwvra';


const transporter = nodemailer.createTransport({
    service:'gmail',
    port: 587,
    auth: {
        user: emailusername,
        pass: emailpassword
    },
    host: 'smtp.gmail.com'

});

module.exports = transporter;