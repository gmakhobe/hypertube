const valiator = require("../assets/validators");
const orm = require("../model/orm-model");

exports.Logout = (req, res) => {
    //Delete user property
    if (!valiator.isObjEmpty(req.session.user)){
        delete req.session.user;
    }
    if (!valiator.isObjEmpty(req.session.passport)){
        delete req.session.passport;
    }
    //Redirect page
    return res.redirect("/login");
}