const nodemailer = require('nodemailer');
const  passwordRetrieval = function(firstname, email, password){

    const message = '<p>Hi ' +firstname + '<br/> It has come to our attention that you forgot your password.  Your login details are below:<br/><br/>\
                    <b>Email Address:</b> ' + email +' <br/>\
                    <b>Password is:</b> ' + password +' <br/><br/>\
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
    subject: 'Password Retrieval',
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

module.exports = passwordRetrieval;