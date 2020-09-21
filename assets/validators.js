const jwt = require("jsonwebtoken");
const privateKey = "matcha like tinder";

exports.isObjEmpty = (obj) => {
    for(var key in obj) {
        return false;
    }
    return true;
}
//Check id an email has @ and . after
exports.isEmail = (param) => {
    let atPosition = param.indexOf('@');
    if (atPosition < 0)
        return false;
    for (let x = atPosition - 1; x < param.length; x++)
        if (param[x] == '.')
            return true;
    return false;
}
//Check if password has lowercase, uppercase and numbers
exports.isPassword = (param) => {
    if (param.length < 6)
            return false;
    let patt = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%&]/g;
    return patt.test(param);
}
//Check if username has lowercase, uppercase and numbers
exports.isUsername = (param) => {
    let patt = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%&]/g;
    return patt.test(param);
}
//Capitalize first letter only
exports.makeNoun = (param) => {
    param = param.toLowerCase();
    return param.charAt(0).toUpperCase() + param.slice(1); 
}
//Get token
exports.token = (obj) => {
    return new Promise((resolve, reject) => {
        let token = jwt.sign(obj, privateKey);
        if (token){
            resolve(token)
        }else{
            reject("error")
        }
    });
}
//Convert "'&<>
exports.aq_formatter = (param) => {
    //Remove &><"'"
	return param.replace(/&/g, "911amp;").replace(/>/g, "911gt;").replace(/</g, "911lt;").replace(/"/g, "911quot;").replace(/'/g, "911apos;");
}
//Convert rev
exports.aq_formatter_rev = (param) => {
	//Reinstate &><"'"
	return param.replace(/911amp;/g, "&").replace(/911gt;/g, ">").replace(/911lt;/g, "<").replace(/911quot;/g, '"').replace(/911apos;/g, "'");
}
