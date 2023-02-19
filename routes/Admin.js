const express = require('express')
const AdminController = require('../controllers/Admin');
const verifyToken = require('../middlewares/auth');
const verifyAdmin = require('../middlewares/auth');
const router = express.Router();


router.get('/',verifyAdmin,verifyToken,AdminController.read);
router.patch('/',verifyAdmin,verifyToken, AdminController.update);
router.delete('/',verifyAdmin,verifyToken, AdminController.destroy);
router.post('/register', AdminController.create);



module.exports = router;