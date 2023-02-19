const express = require('express')
const SignInController = require('../controllers/SignIn');
const router = express.Router();

router.post('/', SignInController.authenticate);

module.exports = router;