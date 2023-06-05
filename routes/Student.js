const express = require('express')
const StudentController = require('../controllers/Student');
const verify = require('../middlewares/auth');
const verifyToken = verify.verifyToken;
const verifyStudent = verify.verifyStudent;
const VideoController = require('../controllers/Video');
const CourseController = require('../controllers/Course');
const MaterialController = require('../controllers/Material');
const QuizController = require('../controllers/Quiz');
const router = express.Router();


router.get('/profile/get',verifyStudent,verifyToken,StudentController.read);
router.patch('/profile/update',verifyStudent,verifyToken, StudentController.update);
router.delete('/profile/delete',verifyStudent,verifyToken, StudentController.destroy);

router.get('/course/get',verifyStudent,verifyToken,CourseController.read);
router.get('/courses/get',verifyStudent,verifyToken,CourseController.read);

router.post('/courser/get',verifyToken,StudentController.courseread);
router.get('/course/get',verifyToken,CourseController.read);
router.get('/courses/get',verifyStudent,verifyToken,CourseController.read);
router.post('/course/purchase',verifyStudent,verifyToken,StudentController.coursepurchase);
router.delete('/course/delete',verifyStudent,verifyToken, StudentController.coursedelete);
router.get('/course/search',verifyStudent,verifyToken,CourseController.read);

router.get('/notification/get',verifyStudent,verifyToken,StudentController.notifget);
router.delete('/notification/delete',verifyStudent,verifyToken, StudentController.notifdel);

router.get('/video/get',verifyStudent,verifyToken,VideoController.read);
router.get('/videos/get',verifyStudent,verifyToken,VideoController.read);
router.get('/video/search',verifyStudent,verifyToken,VideoController.read);

router.get('/material/get',verifyStudent,verifyToken,MaterialController.read);
router.get('/materials/get',verifyStudent,verifyToken,MaterialController.read);
router.get('/material/search',verifyStudent,verifyToken,MaterialController.read);

router.get('/quiz/get',verifyStudent,verifyToken,QuizController.read);
router.post('/quiz/submit',verifyStudent,verifyToken,StudentController.quizsubmit);








module.exports = router;