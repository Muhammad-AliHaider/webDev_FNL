const express = require('express')
const StudentController = require('../controllers/Student');
const verifyToken = require('../middlewares/auth');
const verifyStudent = require('../middlewares/auth');
const VideoController = require('../controllers/Video');
const router = express.Router();


router.get('/profile/get',verifyStudent,verifyToken,StudentController.read);
router.patch('/profile/update',verifyStudent,verifyToken, StudentController.update);
router.delete('/profile/delete',verifyStudent,verifyToken, StudentController.destroy);

// router.get('/get_Video',verifyTeacher,verifyToken,VideoController.read);

//router.get('/notification/get',verifyStudent,verifyToken,StudentController.notifget);
//router.patch('/notfication/delete',verifyStudent,verifyToken, StudentController.notifdel);


module.exports = router;