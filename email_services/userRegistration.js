const nodemailer = require('nodemailer');

exports.sendMail = (toUser, subject, message) => {
    // create reusable transporter object using the default SMTP
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'matcha2021@gmail.com',
            pass: 'Matcha@2020!'
        }
    });
    return new Promise((resolve, reject) => {
        let info = transporter.sendMail({
            from: '"Hypertube Support" <matcha2021@gmail.com>', // sender address
            to: toUser, // list of receivers
            subject: subject, // Subject line
            html: message, // html body});
        });
        if(info)
            resolve(info);
        else
            reject(info);
    });
}