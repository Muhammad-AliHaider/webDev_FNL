const express = require('express')
const UserController = require('../controllers/User');
const verifyToken = require('../middlewares/auth');
const router = express.Router();


router.get('/',verifyToken,UserController.read);
router.patch('/',verifyToken, UserController.update);
router.delete('/',verifyToken, UserController.destroy);
router.post('/register', UserController.create);
router.post('/authenticate', UserController.authenticate);


module.exports = router;