const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET for pages under. */
router.get('/api/login/42', passport.authenticate('42'));

router.get('/api/login/42/callback',
    passport.authenticate('42', { failureRedirect: '/login' }),
    (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/User/Profile');
});


module.exports = router;