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
    res.render('profile', { title: 'Matcha' });
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