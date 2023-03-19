const express = require('express')
const SignInController = require('../controllers/Auth/SignIn');
const SignUpController = require('../controllers/Auth/SignUp');
const SignOutController = require('../controllers/Auth/SignOut');
const ForgotPassController = require('../controllers/Auth/forgotPass');
const router = express.Router();

router.post('/signin', SignInController.authenticate);
router.post('/signup', SignUpController.create);
router.get('/signup/verify/:token', SignUpController.verify);
router.get('/signout', SignOutController.terminate);
router.get('/forgotpass', ForgotPassController.authenticate); 
router.post('/forgotpass/verify/:token', ForgotPassController.verify);  

module.exports = router; 