const mailers = require('../email_services/userRegistration');
const bcrypt = require('bcryptjs');
const validator = require("../assets/validators");
const orm = require("../model/orm-model");

const AppName = "Hypertube";

let userData; // Will store user data obtain from login

exports.ForgotPassword = (req, res) => {
    const email = validator.aq_formatter(req.body.email);

    orm.SELECT(`SELECT * FROM Users WHERE EmailAddress = "${email}";`)
    .then(data0 => {
        if(!validator.isObjEmpty(data0[0])){

            const _name = validator.aq_formatter_rev(data0[0]['FirstName']);
            const _hash = validator.aq_formatter(data0[0]['CustomHash']);

            const sendMailMessage = `Hi ${_name}, Here is a link to reset your password <a href="http://localhost:5001/PasswordReset/${_hash}">http://localhost:5001/PasswordReset/${_hash}</a>`;
            mailers.sendMail(validator.aq_formatter_rev(email), "Reset Password", sendMailMessage);

            return res.render('forgotpassword', { title: AppName, success: 1 });
        }else{
            return res.render('forgotpassword', { title: AppName, success: -1 });
        }
    })
    .catch(data0 => {
        res.render('forgotpassword', { title: AppName, success: 0 });
    })
}
//Is called when a user register
exports.Register = (req, res) => {
    //Capturing info user posted
    const name = validator.aq_formatter(validator.makeNoun(req.body.firstname));
    const surname = validator.aq_formatter(validator.makeNoun(req.body.lastname));
    const username = validator.aq_formatter(req.body.username);
    const email = validator.aq_formatter(req.body.email);
    const password = validator.aq_formatter(req.body.password);
    
    if (!validator.isEmail(email)){
        res.send({
            "status": 0,
            "message": "Please enter a valid email address!"
        });
        return ;
    }
    if (!validator.isPassword(password)){
        res.send({
            "status": 0,
            "message": "Password has to be a combination of uppercase, lowercase and numbers"
        });
        return ;
    }
    if (!validator.isUsername(username)){
        res.send({
            "status": 0,
            "message": "Username has to be a combination of uppercase, lowercase and numbers"
        });
        return ;
    }

    //Generate Salt
    bcrypt.genSalt(10, (error, salt) => {
        //Hash the password
        bcrypt.hash(password, salt, (error, hash) => {
            //Generate custome hash 
            const customHash = Math.floor((Math.random() * 999999999) + 100000000);
            const sql = `INSERT INTO Users(FirstName, LastName, Username, EmailAddress, Passcode, CustomHash, Active) VALUES ("${name}", "${surname}", "${username}","${email}", "${hash}", "${customHash + username}", ${0})`;

            orm.INSERT(sql)
            .then(message => {
                if (message){
                    //Email content
                    const _name = validator.aq_formatter_rev(name);
                    const _surname = validator.aq_formatter_rev(surname);
                    const _email = validator.aq_formatter_rev(email);
                    const mail = {
                        toUser: _email,
                        subject: "Email verification | Matcha",
                        message: `Hello ${_name} ${_surname}<br> <a href="http://localhost:5001/verify/token/${customHash + username}">Please click here to verify your     email address</a>.`
                    };
                    //Node mailer simplified
                    mailers.sendMail(mail.toUser, mail.subject, mail.message)
                    .then(res => {
                        console.log("Mail Sent Success");
                        console.log(res);
                    })
                    .catch(message => {
                        console.log("Email Logger:");
                        console.log(message);
                    });
                    // End Close DB Connection
                    return res.send({
                        "status": 1,
                        "message": `User was registered successful please go to your email and click verify to be able to login! !`
                    });
                }else{
                    return res.send({
                        "status": 0,
                        "message": `An error occured please try again with different username and or email.`
                    });
                }
            })
            .catch(message => {

                console.log(message);

                return res.send({
                    "status": 0,
                    "message": `An error occured please try again with different username and or email.`,
                    "error": message
                });     
            })
        });
    });
}
//Called when a user login
exports.Login = (req, res) => {
    //Capturing info user posted
    const email = validator.aq_formatter(req.body.email);
    const password = validator.aq_formatter(req.body.password);

    orm.SELECT(`SELECT * FROM Users WHERE EmailAddress = "${email}" OR Username = "${email}"`)
    .then(results => {
        console.log(results.length);
        if (results.length){
            userData = results[0];
            results[0] = null;

            bcrypt.compare(password, userData.Passcode, (error, result) => {
                // Reject login if Active is 0
                if (!userData.Active){
                    return res.send({
                        "status": 0,
                        "message": `You need to varify your account first before you can login!!`
                    });
                }
                if (error || !result){
                    return res.send({
                        "status": 0,
                        "message": `Email or Password is incorrect!`
                    });
                }else{
                    
                        //Get token
                        validator.token({username: userData.Username})
                        .then(token => {
                            //Add token to our object
                            userData.Token = token;
                            req.session.user = {
                                id: userData.EmailAddress
                            };
                            //delete properties in an object
                            delete userData.UserId;
                            delete userData.Active;
                            delete userData.CustomHash;
                            delete userData.LoginStatus;
                            delete userData.Passcode;
                            //respond with status 1, message and output
                            return res.send({
                                "status": 1,
                                "message": `Login Success, please wait you will be redirected`,
                                "output": userData
                            });
                        })
                        .catch(error => {
                            // End Close DB Connection
                            return res.send({
                                "status": 0,
                                "message": `An error occured please try again [Error is regarding JWT]: ${error}!`
                            });
                        });
                }
            });
        }else{
            return res.send({
                "status": 0,
                "message": "Please enter a valid email address or password!"
            });
        }
    })
    .catch();
}
