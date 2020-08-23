const express = require('express');
const router = express.Router();
const controllerUserGet = require("../controller/user-get");
const controllerUserPost = require("../controller/user-post");
const CheckSession = require('../middleware/CheckSession');

/* GET method for locating pages under /User. */
router.get('/User/Profile', CheckSession,controllerUserGet.Profile);
// Post homepage
router.post('/User/logout', controllerUserPost.Logout);

module.exports = router;
