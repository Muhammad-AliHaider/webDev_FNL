const express = require('express')
const SignUpController = require('../controllers/SignUp');
const router = express.Router();


router.post('/', SignUpController.create);


module.exports = router;