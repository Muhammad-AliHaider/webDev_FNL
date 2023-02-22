const express = require('express')
const router = express.Router();
const TeacherController = require('../controllers/Teacher');
const verifyToken = require('../middlewares/auth');
const verifyTeacher = require('../middlewares/auth');


// router.post('/',TeacherController.create);
router.get('/',verifyTeacher,verifyToken,TeacherController.read);



module.exports = router;