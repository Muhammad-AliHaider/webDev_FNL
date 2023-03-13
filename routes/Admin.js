const express = require('express')
const AdminController = require('../controllers/Admin');
const verify = require('../middlewares/auth');
const verifyToken = verify.verifyToken;
const verifyAdmin = verify.verifyAdmin;
const router = express.Router();


router.get('/',verifyAdmin,verifyToken,AdminController.read);
router.patch('/',verifyAdmin,verifyToken, AdminController.update);
router.delete('/',verifyAdmin,verifyToken, AdminController.destroy);
// router.post('/register', AdminController.create);

// router.get("/abc" , AdminController.abc)



module.exports = router;