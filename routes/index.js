const express = require('express');
const router = express.Router();
const controllerIndexGet = require("../controller/index-get");
const controllerIndexPost = require("../controller/index-post");

/* GET for pages under. */
router.get('/', controllerIndexGet.Index);
router.get('/login', controllerIndexGet.Login);
router.get('/register', controllerIndexGet.Register);
router.get('/forgotpassword', controllerIndexGet.ForgotPassword);
router.get('/verify/token/:token', controllerIndexGet.Verify);
// Post Method for pages under /
router.post('/register', controllerIndexPost.Register);
router.post('/forgotpassword', controllerIndexPost.ForgotPassword);
router.post('/login', controllerIndexPost.Login);


module.exports = router;