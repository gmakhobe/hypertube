const express = require('express');
const router = express.Router();
const controllerUserGet = require("../controller/user-get");
const controllerUserPost = require("../controller/user-post");
const CheckSession = require('../middleware/CheckSession');

/* GET method for locating pages under /User. */
router.get('/User/Profile', CheckSession, controllerUserGet.Profile);
router.get('/User/logout', controllerUserPost.Logout);
router.get('/User/library', controllerUserGet.Library);
// Post Method
router.post('/user/profile/data', CheckSession, controllerUserPost.ProfileUserData);
router.post('/user/profile/passcode', CheckSession, controllerUserPost.ProfileUserPasscode);
router.post('/user/profile/picture', CheckSession, controllerUserPost.ProfileUserPicture);
router.post('/user/library/search'/*, CheckSession*/ , controllerUserPost.Library);

module.exports = router;
