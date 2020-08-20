const nodemailer = require('nodemailer');

exports.UserRegistration = function(email, firstname){
    const message = '<h2>Welcome to Matcha</h2>\
                    <p>Hi ' +firstname + '<br/> Thank you for registering on Matcha, in order to meet your soulmate, you need to click the link below to verify your account.</p>\
                    <p><a style="font-size: 18px; padding:8px; text-decoration:none;color:white;background-color: #198ae3; border-color: #198ae3;" href="http://localhost:5000/login?action=verify&email_address=$email_address&token=$token">Verify Account</a><br/><br/><br/><br/>\
                    Happy Matching<br/>\
                    Matcha Team!<br/></p>'
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

    const mailOptions = {
    from: 'matcha2021@gmail.com', 
    to: email,
    subject: 'Matcha Email Verification',
    html: message
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
    });
}

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
            from: '"Matcha Support" <matcha2021@gmail.com>', // sender address
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