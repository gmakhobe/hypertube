const AppName = "Hypertube";
const validator = require('../assets/validators');
const orm = require('../model/orm-model');
//Controller method for /encounter page
exports.Encounter = (req, res) => {
    res.render('encounter', { title: 'Matcha' });
}
//Controller method for /visitors page
exports.Visitors = (req, res) => {
    res.render('visitors', { title: 'Matcha' });    
}
//Controller method for /likes page
exports.Likes = (req, res) => {
    res.render('likes', { title: 'Matcha' });    
}
//Controller method for /nearby page
exports.Nearby = (req, res) => {
    res.render('nearby', { title: 'Matcha' });
}
//Controller method for /settings page
exports.Settings = (req, res) => {
    res.render('settings', { title: 'Matcha' });
}
//Controller method for /profile page
exports.Profile = (req, res) => {
    //Set session
    if (!validator.isObjEmpty(req.session.user)){
        //Set variable 
        $Key = req.session.user.id;
    }

    if (!validator.isObjEmpty(req.session.passport)){
        //Set variable
        $Key = req.session.passport.user.id;
    }

    orm.SELECT(`SELECT * FROM Users WHERE EmailAddress = "${$Key}" OR IntraID = "${$Key}"`)
    .then(res1 => {
        const userInfo = {
            Name: res1[0].FirstName,
            Surname: res1[0].LastName,
            Email: res1[0].EmailAddress,
            Username: res1[0].Username,
            ProfilePicture: (res1[0].ProfilePicture || res1[0].ProfilePicture.length > 5 ? res1[0].ProfilePicture : "/images/profile.svg")
        };
        //res.send($Key);
        res.render('Storage/profile', { title: AppName, appSection: "Profile", information: userInfo });
    })
    .catch(res1 => {
        //Redirect if there is an error
        res.redirect('/login');
    });

}
//Controller method for /preference page
exports.Preference = (req, res) => {
    res.render('preference', { title: 'Matcha' });
}
//Controller method for /messages page
exports.Messages = (req, res) => {
    res.render('messages', { title: 'Matcha' });
}
//Controller method for /matched page
exports.Matched = (req, res) => {
    res.render('matched', { title: 'Matcha' });
}