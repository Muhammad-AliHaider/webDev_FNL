const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const StudentModel = require('../models/student');
const CourseModel = require('../models/course');
const QuizModel = require('../models/quiz');
const CardModel = require('../models/quiz_card');
const jwt = require('jsonwebtoken');



module.exports = {    
    read: async function (req,res){
        {
            try {
                const authHeader = req.headers['authorization'];
                // Extract token from header
                const token = authHeader && authHeader.split(' ')[1];
                const decodedToken = jwt.decode(token, {
                    complete: true
                });
                const user = await UserModel.findOne({_id : decodedToken.payload.id});
                console.log(user)
                const std = await StudentModel.findOne({ID : decodedToken.payload.id});
                //console.log(Acces's1',res.getHeader('Access'))
                res.status(200).json({data: user,std});
                
            } catch(error) {
                
                res.status(404).json({message: error.message});
            }
        };
    },

    update : async function (req,res){
        const authHeader = req.headers['authorization'];
// Extract token from header
const token = authHeader && authHeader.split(' ')[1];
const decodedToken = jwt.decode(token, {
  complete: true
});

console.log(req.body.profileData)

UserModel.findOne({ _id: decodedToken.payload.id })
  .then(user => {
    if (!user) {
      res.status(404).send({
        message: `User not found.`
      });
      return;
    }

    // Assuming email is a field that should not be modified
    if (req.body.profileData.email) {
      res.status(400).send({
        message: "Email address cannot be modified."
      });
      return;
    }

    // Update user document
    user.set(req.body.profileData);

    // Save the updated user document
    return user.save();
  })
  .then(updatedUser => {
    console.log(updatedUser);
    res.status(200).send({ message: "User updated successfully." })
  })
  .catch(err => {
    res.status(500).send({
      message: err.message
    });
  });

    },

    destroy: async function (req,res){
        const authHeader = req.headers['authorization'];
        // Extract token from header
        const token = authHeader && authHeader.split(' ')[1];
            const decodedToken = jwt.decode(token, {
                 complete: true
            });
    await UserModel.findOneAndRemove({_id: decodedToken.payload.id}).then(data => {
        if (!data) {
          res.status(404).send({
            message: `User not found.`
          });
        } else {
          StudentModel.findOneAndRemove({ID: decodedToken.payload.id}).then(data =>{
            if (!data) {
                res.status(404).send({
                  message: `Student not found.`
                });
            }
          })
          res.send({
            message: "User deleted successfully!"
          });
        }
    }).catch(err => {
        res.status(500).send({
          message: err.message
        });
    });
   
    },

    notifget: async function (req,res){
        {
            console.log("notifget");
            try {
                const authHeader = req.headers['authorization'];
        // Extract token from header
                const token = authHeader && authHeader.split(' ')[1];
                const decodedToken = jwt.decode(token, {
                    complete: true
                });
                const user = await UserModel.findOne({_id : decodedToken.payload.id});
                
                res.status(200).json({Headers : res.getHeader("access") ,data: user.Notification});
                // console.log("here _____________________")
                // console.log(res.getHeader("access"));
            } catch(error) {
                res.status(404).json({message: error.message});
            }
        };
    },

    notifdel: async function (req,res){
        {
            try {
                console.log(req.body)
                const authHeader = req.headers['authorization'];
        // Extract token from header
        const token = authHeader && authHeader.split(' ')[1];
                const decodedToken = jwt.decode(token, {
                    complete: true
                });
                const user = await UserModel.findOne({_id : decodedToken.payload.id});
                const inter = user.Notification.filter(object =>{
                    return object._id != req.body._id;
                })

                console.log(inter)
                await UserModel.findOneAndUpdate({_id: decodedToken.payload.id},{Notification: inter}, { useFindAndModify: false })
                res.status(200).json({data:"Notification Deleted Successfully" });
            } catch(error) {
                res.status(404).json({message: error.message});
            }
        };
    },

    coursepurchase: async function (req,res){
        {
            try {
                const authHeader = req.headers['authorization'];
                const token = authHeader && authHeader.split(' ')[1];
                const decodedToken = jwt.decode(token, {
                    complete: true
                });
                console.log("Decoded token ID: ", decodedToken.payload.id); // log user ID from the token
            
                const user = await UserModel.findOne({_id : decodedToken.payload.id});
                let student = await StudentModel.findOne({ID: user._id});
                let course = await CourseModel.findOne({_id: req.body.ID})
            
                console.log("Course ID: ", req.body.ID); // log course ID
            
                // Updating the student document
                student.CourseEnrolled.push({id: req.body.ID, progress:[], name: course.Name});
                await student.save(); 
            
                // Updating the course document
                course.Students.push(decodedToken.payload.id);
                course.isPurchased = true;
                await course.save();
            
                var str1 = "New Course Added: ";
                var str2 = str1.concat(course.Name);
                notifgen(user, str2);
            
                res.status(200).json({data:"Course Purchased Successfully" });
            
            } catch(error) {
                console.error(error) // log any errors that occur
                res.status(404).json({message: error.message});
            }
            
        };
    },

    coursedelete: async function (req,res){
        {
            try {
                const authHeader = req.headers['authorization'];
        // Extract token from header
        const token = authHeader && authHeader.split(' ')[1];
                const decodedToken = jwt.decode(token, {
                    complete: true
                });
                const user = await UserModel.findOne({_id : decodedToken.payload.id});
                const student =  await StudentModel.findOne({ID : decodedToken.payload.id});
                const inter = student.CourseEnrolled.filter(object =>{
                    return object.id != req.body.ID;
                })
                await StudentModel.findOneAndUpdate({ID: decodedToken.payload.id},{CourseEnrolled: inter}, { useFindAndModify: false })
                const course = await CourseModel.findOne({_id: req.body.ID})
                str1 = "Course Deleted: "
                str2 = str1.concat(course.Name)
                notifgen(user,str2)
                res.status(200).json({data:"Course Deleted Successfully" });
            } catch(error) {
                res.status(404).json({message: error.message});
            }
        };
    },

    quizsubmit: async function(req,res){
        {
            try {
                var score = 0
                const quiz = await QuizModel.findOne({_id: req.body.quiz_id})
                const answer = req.body.answers
                var answers1= answer.split(",");
                var answers = []
                var z = 0
                for (let i = 0; i < answers1.length; i=i+2) {
                    answers[z] = [answers1[i],answers1[i+1]]
                    z++
                }
                for (let i = 0; i < answers.length; i++) {
                    for (let j=0; j<quiz.Quiz_card.length;j++){
                        id = quiz.Quiz_card[j]._id.toString()
                        if(((answers[i])[0])==id){
                            const card = await CardModel.findOne({_id: id})
                            if(((answers[i])[1])==card.Answer){
                                score = score + 1
                            }
                        }
                    }
                }
                const authHeader = req.headers['authorization'];
        // Extract token from header
        const token = authHeader && authHeader.split(' ')[1];
                const decodedToken = jwt.decode(token, {
                    complete: true
                });
                var student = await StudentModel.findOne({ID : decodedToken.payload.id});
                
                for (let i = 0; i < student.CourseEnrolled.length; i++) {
                    var inter =[]
                    if (req.body.course_id == student.CourseEnrolled[i].id){
                        const nm = student.CourseEnrolled[i].name
                        const ids = student.CourseEnrolled[i].id
                        interim = student.CourseEnrolled.filter(object =>{
                            return object.id == ids;
                        })
                        //console.log(interim)
                        var old = interim[0].progress.concat({quiz: req.body.quiz_id,score: score , name: quiz.Name})
                        inter = student.CourseEnrolled.filter(object =>{
                            return object.id != ids;
                        })
                        inter.push({id: ids , progress: old,name : nm})
                        await StudentModel.findOneAndUpdate({ID: decodedToken.payload.id},{CourseEnrolled: inter}, { useFindAndModify: false })
                    }
                }
               
                res.status(200).json({data:"Quiz Submitted Successfully", Score:score,OutOf: 10});
            } catch(error) {
                res.status(404).json({message: error.message});
            }
        };
    },

    courseread: async function(req, res, next) {
        console.log(req.body)
        if(req.body._id){
            try{
                console.log( "bahar")
                const ser = await CourseModel.find({_id : req.body._id , status :true}).populate('VideoID').populate('MaterialID');
                if(ser.length != 0){
                    res.json({status: "success", message: "Course found!!!", data: ser});
                }
                else{
                    res.json({status: "failure", message: "Course not found!!!", data: null});
                }
            }
            catch(err){
                res.json({status: "failure1", message: "Course not found!!!", data: null});
            }
        }
        else if(req.body.courseData._id){
            try{
                console.log(req.body.courseData._id)
                console.log( "andar")
                const ser = await CourseModel.find({_id : req.body.courseData._id , status :true}).populate('VideoID').populate('MaterialID');
                console.log(ser)
                if(ser.length != 0){
                    res.json({status: "success", message: "Course found!!!", data: ser});
                }
                else{
                    res.json({status: "failure", message: "Course not found!!!", data: null});
                }
            }
            catch(err){
                res.json({status: "failure1", message: "Course not found!!!", data: null});
            }
        }
        else if(req.body.Name){
            try {
                const courses = await CourseModel.find({status :true});
                if(req.body.Name){
                    const inter = courses.filter(object =>{
                        return object.Name.includes((req.body.Name).toUpperCase());
                    })
                    res.status(200).json(inter);
                }
                else{
                    res.status(200).json(courses);
                }
            } catch(error) {
                res.status(404).json({message: error.message});
            }
        }
        else{
            try{
                console.log("yeha aya")
            const ser = await CourseModel.find({ status :true});
            if(ser.length != 0){
                console.log('Course',ser)
                res.json({status: "success", message: "Course found!!!", data: ser});
            }
            else{
                res.json({status: "failure", message: "Course not found!!!", data: null});
            }}
            catch(err){
                res.json({status: "failure", message: "Course not found!!!", data: null});
            }
        }

    },

   
}

async function notifgen(user,msg){
    const combined1 = user.Notification.concat({message: msg,timestamp: Date.now()});
    await UserModel.findOneAndUpdate({_id: user._id},{Notification: combined1}, { useFindAndModify: false })
    return 0
}

