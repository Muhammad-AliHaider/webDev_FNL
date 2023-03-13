const express = require('express')
const StudentController = require('../controllers/Student');
const verifyToken = require('../middlewares/auth');
const verifyStudent = require('../middlewares/auth');
const VideoController = require('../controllers/Video');
const CourseController = require('../controllers/Course');
const router = express.Router();


router.get('/profile/get',verifyStudent,verifyToken,StudentController.read);
router.patch('/profile/update',verifyStudent,verifyToken, StudentController.update);
router.delete('/profile/delete',verifyStudent,verifyToken, StudentController.destroy);

router.get('/course/get',verifyStudent,verifyToken,CourseController.read);
router.get('/courses/get',verifyStudent,verifyToken,CourseController.read);

router.post('/course/purchase',verifyStudent,verifyToken,StudentController.coursepurchase);
router.delete('/course/delete',verifyStudent,verifyToken, StudentController.coursedelete);
router.get('/course/search',verifyStudent,verifyToken,StudentController.selectcourse);

router.get('/notification/get',verifyStudent,verifyToken,StudentController.notifget);
router.delete('/notification/delete',verifyStudent,verifyToken, StudentController.notifdel);

router.get('/video/get',verifyStudent,verifyToken,VideoController.read);
router.get('/videos/get',verifyStudent,verifyToken,VideoController.read);




module.exports = router;