const express = require('express')
const StudentController = require('../controllers/Student');
const verifyToken = require('../middlewares/auth');
const verifyStudent = require('../middlewares/auth');
const router = express.Router();


router.get('/profile/get',verifyStudent,verifyToken,StudentController.read);
router.patch('/profile/update',verifyStudent,verifyToken, StudentController.update);
router.delete('/profile/delete',verifyStudent,verifyToken, StudentController.destroy);
router.get('/course/get',verifyStudent,verifyToken,StudentController.get_course);
router.get('/courses/get',verifyStudent,verifyToken,StudentController.get_courses);
router.post('/course/purchase',verifyStudent,verifyToken,StudentController.coursepurchase);
router.get('/notification/get',verifyStudent,verifyToken,StudentController.notifget);
router.delete('/notification/delete',verifyStudent,verifyToken, StudentController.notifdel);



module.exports = router;