const validator = require("../assets/validators");
const orm = require("../model/orm-model");
const passport = require("passport");

const AppName = "Hypertube";
//Controller method for / page
exports.Index = (req, res) => {
    res.render('index', { title: AppName });
}
//Controller method for /login page
exports.Login = (req, res) => {
    res.render('login', { title: AppName });
}
//Controller method for /register page
exports.Register = (req, res) => {
    res.render('register', { title: AppName });
}
//Controller method for /forgotpassword page
exports.ForgotPassword = (req, res) => {
    res.render('forgotpassword', { title: AppName });
}

exports.Verify = (req, res) => {
    if (!validator.isObjEmpty(!req.params))
        res.render('verify', { title: AppName, status: 0, message: "An error occured, email address not varified!" });
    else{
        const token = req.params.token;
        orm.SELECT(`SELECT * FROM Users WHERE CustomHash = "${token}"`)
        .then(results => {
            
            orm.UPDATE(`UPDATE Users SET Active = 1 WHERE CustomHash = "${token}"`)
            .then(results => {
                if (results)
                    res.render('verify', { title: AppName, status: 1, message: "Account Varified!" });
                else
                    res.render('verify', { title: AppName, status: 1, message: "Account Already Varified or token has expired!" });
            })
            .catch(results => {
                res.render('verify', { title: AppName, status: 1, message: `An error occured, email address not varified! Error Log: ${results}` });
            }); 
        })
        .catch(results => {
            console.log("Error");
            console.log(results);
            res.render('verify', { title: AppName, status: 1, message: "An error occured, email address not varified!" });
        });
    }
}

exports.LoginCB = (req, res) => {
    passport.authenticate(42, { session: false }, (err, user, info) => {

      if (err) {
        console.error(err)
        return res.send(user);
      }
      if (!user)
        return res.send(user);

    console.log(user);
    return res.send(user);
    });
    console.log(req);
    return res.send("loaded");
}