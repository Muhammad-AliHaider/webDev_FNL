const express = require('express')
const AdminController = require('../controllers/Admin');
const VideoController = require('../controllers/Video');
const MaterialController = require('../controllers/Material');
const CourseController = require('../controllers/Course');
const QuizController = require('../controllers/Quiz');
const Quiz_cardController = require('../controllers/Quiz_card');
const verify = require('../middlewares/auth');
const verifyToken = verify.verifyToken;
const verifyAdmin = verify.verifyAdmin;
const router = express.Router();


// Admin Management
router.get('/profile/getAllStudents',verifyAdmin,verifyToken,AdminController.read);
router.get('/profile/getAllTeachers',verifyAdmin,verifyToken,AdminController.readTeacher);
//User Management
router.get('/notification/get',verifyAdmin,verifyToken,AdminController.notifget);
router.delete('/notification/delete',verifyAdmin,verifyToken, AdminController.notifdel);
router.get('/profile/get',verifyAdmin,verifyToken,AdminController.readprofile);
router.patch('/profile/update',verifyAdmin,verifyToken, AdminController.profileupdate);
router.get('/',verifyAdmin,verifyToken,AdminController.read);
router.get('/get_teachers',verifyAdmin,verifyToken,AdminController.read_teachers);
router.put('/',verifyAdmin,verifyToken, AdminController.update);
router.delete('/delete_user',verifyAdmin,verifyToken, AdminController.destroy);
router.post('/add_user',verifyAdmin,verifyToken,AdminController.add_user);
router.put('/update_user',verifyAdmin,verifyToken,AdminController.update_user);
router.post('/get_user',verifyToken,AdminController.getUserName);

router.put('/add_courses_teacher',verifyAdmin,verifyToken,AdminController.add_courses_teacher);
router.put('/remove_courses_teacher',verifyAdmin,verifyToken,AdminController.remove_courses_teacher);
router.put('/add_courses_student',verifyAdmin,verifyToken,AdminController.add_course_student);


// course management
router.post('/create_Course',verifyAdmin,verifyToken,CourseController.create);
router.get('/get_Course',verifyAdmin,verifyToken,CourseController.read);
router.put('/update_Course',verifyAdmin,verifyToken,CourseController.update);
router.delete('/delete_Course',verifyAdmin,verifyToken,CourseController.destroy);
// add videos in courses
router.put('/add_Videos',verifyAdmin,verifyToken,CourseController.add_video);
router.put('/remove_Videos',verifyAdmin,verifyToken,CourseController.remove_video);
// add material in courses
router.put('/add_Materials',verifyAdmin,verifyToken,CourseController.add_material);
router.put('/remove_Materials',verifyAdmin,verifyToken,CourseController.remove_material);


// videos Management
router.post('/create_Video',verifyAdmin,verifyToken,VideoController.create);
router.get('/get_Video',verifyAdmin,verifyToken,VideoController.read);
router.put('/update_Video',verifyAdmin,verifyToken,VideoController.update);
router.delete('/delete_Video',verifyAdmin,verifyToken,VideoController.destroy);
// add quiz in videos 
router.put('/add_quiz',verifyAdmin,verifyToken,VideoController.add_quiz);
router.put('/remove_quiz',verifyAdmin,verifyToken,VideoController.remove_quiz);


// Quiz Management
router.post('/create_quiz',verifyAdmin,verifyToken,QuizController.create);
router.get('/get_quiz',verifyAdmin,verifyToken,QuizController.read);
router.delete('/delete_quiz',verifyAdmin,verifyToken,QuizController.destroy);
// add quiz_card in quiz
router.put('/add_content',verifyAdmin,verifyToken,QuizController.add_content);
router.put('/remove_content',verifyAdmin,verifyToken,QuizController.remove_content);


// material Management
router.post('/create_Material',verifyAdmin,verifyToken,MaterialController.create);
router.get('/get_Material',verifyAdmin,verifyToken,MaterialController.read);
router.put('/update_Material',verifyAdmin,verifyToken,MaterialController.update);
router.delete('/delete_Material',verifyAdmin,verifyToken,MaterialController.destroy);


// Quiz_card Management
router.post('/create_quiz_card',verifyAdmin,verifyToken,Quiz_cardController.create);
router.get('/get_quiz_card',verifyAdmin,verifyToken,Quiz_cardController.read);
router.put('/update_quiz_card',verifyAdmin,verifyToken,Quiz_cardController.update);
router.delete('/delete_quiz_card',verifyAdmin,verifyToken,Quiz_cardController.destroy);
//add options in quiz_card
router.put('/add_options',verifyAdmin,verifyToken,Quiz_cardController.add_options);
router.put('/remove_options',verifyAdmin,verifyToken,Quiz_cardController.remove_options);


//router.get('/notification/get',verifyStudent,verifyToken,StudentController.notifget);
//router.patch('/notfication/delete',verifyStudent,verifyToken, StudentController.notifdel);





module.exports = router;