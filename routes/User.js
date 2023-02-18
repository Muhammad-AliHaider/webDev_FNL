const express = require('express')
const UserController = require('../controllers/User');
const verifyToken = require('../middlewares/auth');
const verifyAdmin = require('../middlewares/auth');
const router = express.Router();


router.get('/',verifyAdmin,verifyToken,UserController.read);
router.patch('/',verifyAdmin,verifyToken, UserController.update);
router.delete('/',verifyAdmin,verifyAdmin,verifyToken, UserController.destroy);
router.post('/register', UserController.create);
router.post('/authenticate', UserController.authenticate);


module.exports = router;