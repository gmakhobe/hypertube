const validator = require('../assets/validators');

module.exports = (req, res, next) => {
    if (!validator.isObjEmpty(req.session.passport) || !validator.isObjEmpty(req.session.user)){
        console.log("Session: Is set!");   
        return next();
    }
    console.log("Session: Not Set!");
    return res.redirect('/');
}