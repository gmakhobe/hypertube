const validator = require('../assets/validators');
const orm = require('../model/orm-model');

module.exports = (req, res, next) => {


    if (!validator.isObjEmpty(req.session.passport)){
        
        orm.SELECT(`SELECT * FROM Users WHERE IntraID = "${req.session.passport.user.id}" AND EmailAddress = "null"`)
        .then(data => {

            if (data.length == 0){
                console.log("Session: Is set!");
                return next();
            }else{
                console.log("Session Is set But Authentication is needed!");
                return res.redirect('/user/init/mail');   
                //return res.redirect('user/init/mail');
            }

        })
        .catch(data => {
            console.log("An error occured: Session Might Not Be Set");
            return res.redirect("/login");    
        });
        
           
        
    }else if (!validator.isObjEmpty(req.session.user)){
        console.log("Session: Is set!");   
        return next();
    }else{
        console.log("Session: Not Set!");
        return res.redirect('/');
    }
}