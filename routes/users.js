const express = require('express');
const router = express.Router();
const register = require('../email_services/userRegistration')
const controllerUserGet = require("../controller/user-get");
const controllerUserPost = require("../controller/user-post");

/* GET method for locating pages under /User. */
router.get('/User/encounter', controllerUserGet.Encounter);
router.get('/User/visitors', controllerUserGet.Likes);
router.get('/User/likes', controllerUserGet.Likes);
router.get('/User/nearby', controllerUserGet.Nearby);
router.get('/User/settings', controllerUserGet.Settings);
router.get('/User/profile', controllerUserGet.Profile);
router.get('/User/preference', controllerUserGet.Preference);
router.get('/User/messages', controllerUserGet.Messages);
router.get('/User/matched', controllerUserGet.Matched);
// Post homepage
router.post('/User/logout', controllerUserPost.Logout);

module.exports = router;
