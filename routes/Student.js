const express = require('express')
const StudentController = require('../controllers/Student');
const verifyToken = require('../middlewares/auth');
const verifyStudent = require('../middlewares/auth');
const router = express.Router();


router.get('/profile/get',verifyStudent,verifyToken,StudentController.read);
router.patch('/profile/update',verifyStudent,verifyToken, StudentController.update);
router.delete('/profile/delete',verifyStudent,verifyToken, StudentController.destroy);

//router.get('/notification/get',verifyStudent,verifyToken,StudentController.notifget);
//router.patch('/notfication/delete',verifyStudent,verifyToken, StudentController.notifdel);


module.exports = router;