const mailer = require('../email_services/userRegistration');
const orm = require('../model/orm-model');
const validator = require('../assets/validators');

const logOrInsert = (profile, cb) => {
    const email = profile.email;
    const appID = profile.id;
    const name = profile.first_name;
    const surname = profile.last_name;
    const username = profile.username;

    orm.SELECT(`SELECT * FROM Users WHERE EmailAddress = "${email}" AND IntraID = "${appID}";`)
    .then(results => {
        
        if (!validator.isObjEmpty(results)){
            return cb(undefined, { id: profile.id });
        }else{
            const customHash = Math.floor((Math.random() * 999999999) + 99999999);
            const sql = `INSERT INTO Users(FirstName, LastName, Username, EmailAddress, CustomHash, Active, IntraID) VALUES ("${name}", "${surname}", "${username}","${email}", "${customHash + username}", ${0}, "${appID}")`;

            orm.INSERT(sql)
            .then(data0 => {

                console.log("Inserted Data: ");
                console.log(data0);

                //Email content
                const mail = {
                    toUser: email,
                    subject: "Email verification | Matcha",
                    message: `Hello ${name} ${surname}<br> <a href="http://localhost:5001/verify/token/${customHash + username}">Please click here to verify your     email address</a>.`
                };
                //Node mailer simplified
                mailer.sendMail(mail.toUser, mail.subject, mail.message)
                .then(res => {
                    console.log("Mail Sent Success");
                    console.log(res);
                })
                .catch(message => {
                    console.log("Email Logger:");
                    console.log(message);
                });

                return cb(undefined, { id: profile.id })

            })
        }

    })
}

module.exports = logOrInsert;