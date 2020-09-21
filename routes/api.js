const express = require('express');
const router = express.Router();
const passport = require('passport');
const fetch = require('node-fetch');

/* GET for pages under. */
router.get('/api/login/42', passport.authenticate('42'));

router.get('/api/login/42/callback',
    passport.authenticate('42', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/User/Profile');
    });

/* GET for pages under. */
router.get('/api/login/github', passport.authenticate('github'));

router.get('/api/login/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        // Successful authentication, redirect home.
        res.redirect('/User/Profile');
    });

//Movie API
/* GET for pages under. */
router.get('/api/movies', (req, res) => {

    fetch(`https://yts.mx/api/v2/list_movies.json?limit=50`, { method: 'GET' })
        .then(res1 => res1.json()) // expecting a json response
        .then(json => {

            res.send(json);

        })
        .catch(message => {
            res.send({Result: "Nothing was returned!"});
        })

});

module.exports = router;