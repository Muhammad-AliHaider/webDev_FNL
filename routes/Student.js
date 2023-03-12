const express = require('express')
const StudentController = require('../controllers/Student');
const verifyToken = require('../middlewares/auth');
const verifyStudent = require('../middlewares/auth');
const VideoController = require('../controllers/Video');
const router = express.Router();


router.get('/profile/get',verifyStudent,verifyToken,StudentController.read);
router.patch('/profile/update',verifyStudent,verifyToken, StudentController.update);
router.delete('/profile/delete',verifyStudent,verifyToken, StudentController.destroy);

router.get('/course/get',verifyStudent,verifyToken,StudentController.get_course);
router.get('/courses/get',verifyStudent,verifyToken,StudentController.get_courses);
router.post('/course/purchase',verifyStudent,verifyToken,StudentController.coursepurchase);
router.delete('/course/delete',verifyStudent,verifyToken, StudentController.coursedelete);
router.get('/course/search',verifyStudent,verifyToken,StudentController.selectcourse);

router.get('/notification/get',verifyStudent,verifyToken,StudentController.notifget);
router.delete('/notification/delete',verifyStudent,verifyToken, StudentController.notifdel);

router.get('/video/get',verifyStudent,verifyToken,StudentController.get_video);
router.get('/videos/get',verifyStudent,verifyToken,StudentController.get_videos);




module.exports = router;