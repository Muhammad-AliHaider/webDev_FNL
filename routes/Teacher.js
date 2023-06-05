const express = require('express')
const router = express.Router();
const TeacherController = require('../controllers/Teacher');
const VideoController = require('../controllers/Video');
const MaterialController = require('../controllers/Material');
const CourseController = require('../controllers/Course');
const QuizController = require('../controllers/Quiz');
const Quiz_cardController = require('../controllers/Quiz_card');

const verify = require('../middlewares/auth');
const verifyToken = verify.verifyToken;
const verifyTeacher = verify.verifyTeacher;



router.get('/profile/get',verifyTeacher,verifyToken,TeacherController.read);
router.patch('/profile/update',verifyTeacher,verifyToken, TeacherController.update);
router.delete('/profile/delete',verifyTeacher,verifyToken, TeacherController.destroy);

// Teacher Management
router.get('/',verifyTeacher,verifyToken,TeacherController.read);
router.put('/',verifyTeacher,verifyToken,TeacherController.update);
router.delete('/',verifyTeacher,verifyToken,TeacherController.destroy);
// add courses to teachers
router.put('/add_courses',verifyTeacher,verifyToken,TeacherController.add_courses);
router.put('/remove_courses',verifyTeacher,verifyToken,TeacherController.remove_courses);


// course management
router.post('/create_Course',verifyTeacher,verifyToken,CourseController.create);
router.get('/get_Course',verifyTeacher,verifyToken,CourseController.read);
router.put('/update_Course',verifyTeacher,verifyToken,CourseController.update);
router.delete('/delete_Course',verifyTeacher,verifyToken,CourseController.destroy);
// add videos in courses
router.put('/add_Videos',verifyTeacher,verifyToken,CourseController.add_video);
router.put('/remove_Videos',verifyTeacher,verifyToken,CourseController.remove_video);

// router.put('/add_Videos',verify.verifyStudent,verifyToken,CourseController.add_video);
// router.put('/remove_Videos',verify.verifyStudent,verifyToken,CourseController.remove_video);



// add material in courses
router.put('/add_Materials',verifyTeacher,verifyToken,CourseController.add_material);
router.put('/remove_Materials',verifyTeacher,verifyToken,CourseController.remove_material);


// videos Management
router.post('/create_Video',verifyTeacher,verifyToken,VideoController.create);
router.get('/get_Video',verifyTeacher,verifyToken,VideoController.read);
router.put('/update_Video',verifyTeacher,verifyToken,VideoController.update);
router.delete('/delete_Video',verifyTeacher,verifyToken,VideoController.destroy);


// router.post('/create_Video',verify.verifyStudent,verifyToken,VideoController.create);
// router.get('/get_Video',verify.verifyStudent,verifyToken,VideoController.read);
// router.put('/update_Video',verify.verifyStudent,verifyToken,VideoController.update);
// router.delete('/delete_Video',verify.verifyStudent,verifyToken,VideoController.destroy);


// add quiz in videos 
router.put('/add_quiz',verifyTeacher,verifyToken,VideoController.add_quiz);
router.put('/remove_quiz',verifyTeacher,verifyToken,VideoController.remove_quiz);


// Quiz Management
router.post('/create_quiz',verifyTeacher,verifyToken,QuizController.create);
router.get('/get_quiz',verifyTeacher,verifyToken,QuizController.read);
router.delete('/delete_Quiz',verifyTeacher,verifyToken,QuizController.destroy);

// add quiz_card in quiz
router.put('/add_content',verifyTeacher,verifyToken,QuizController.add_content);
router.put('/remove_content',verifyTeacher,verifyToken,QuizController.remove_content);


// material Management
router.post('/create_Material',verifyTeacher,verifyToken,MaterialController.create);
router.get('/get_Material',verifyTeacher,verifyToken,MaterialController.read);
router.put('/update_Material',verifyTeacher,verifyToken,MaterialController.update);
router.delete('/delete_Material',verifyTeacher,verifyToken,MaterialController.destroy);


// Quiz_card Management
router.post('/create_quiz_card',verifyTeacher,verifyToken,Quiz_cardController.create);
router.get('/get_quiz_card',verifyTeacher,verifyToken,Quiz_cardController.read);
router.put('/update_quiz_card',verifyTeacher,verifyToken,Quiz_cardController.update);
router.delete('/delete_quiz_card',verifyTeacher,verifyToken,Quiz_cardController.destroy);
//add options in quiz_card
router.put('/add_options',verifyTeacher,verifyToken,Quiz_cardController.add_options);
router.put('/remove_options',verifyTeacher,verifyToken,Quiz_cardController.remove_options);


router.get('/notification/get',verifyTeacher,verifyToken,TeacherController.notifget);
router.delete('/notification/delete',verifyTeacher,verifyToken, TeacherController.notifdel);





module.exports = router;