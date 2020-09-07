const validator = require('../assets/validators');
const orm = require('../model/orm-model');
//Set Session
module.exports = (req, res, next) => {

    if (!validator.isObjEmpty(req.session.user)){
        //Select from Users table
        orm.SELECT(`SELECT * FROM Users WHERE EmailAddress = "${req.session.user.id}"`)
        .then(res1 => {
            //Set Session
            console.log("+++++++++++++++++++++++++++++++++++++++++");
            req.session.UserInfo = {
                Name: res1[0].FirstName,
                Surname: res1[0].LastName,
                Username: res1[0].Username,
                Email: res1[0].EmailAddress,
                ProfilePicture: res1[0].ProfilePicture
            }
        })
        .catch(res2 => {
            console.log("Faailed to get user info");
        })
    }

    if (!validator.isObjEmpty(req.session.passport)){
        //Select from Users table
        orm.SELECT(`SELECT * FROM Users WHERE IntraID = "${req.session.passport.user.id}"`)
        .then(res1 => {
            //Set Session
            req.session.UserInfo = {
                Name: res1[0].FirstName,
                Surname: res1[0].LastName,
                Username: res1[0].Username,
                Email: res1[0].EmailAddress,
                ProfilePicture: res1[0].ProfilePicture
            }
        })
        .catch(res2 => {
            console.log("Faailed to get user info");
        })
    }
    return next();
}
