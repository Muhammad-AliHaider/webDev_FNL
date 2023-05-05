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
                //console.log(user)
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

        
    
        await UserModel.findOneAndUpdate({_id: decodedToken.payload.id}, req.body, { useFindAndModify: false }).then(data => {
            if (!data) {
                res.status(404).send({
                    message: `User not found.`
                });
            }else{
                res.send({ message: "User updated successfully." })
            }
        }).catch(err => {
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
                const authHeader = req.headers['authorization'];
        // Extract token from header
        const token = authHeader && authHeader.split(' ')[1];
                const decodedToken = jwt.decode(token, {
                    complete: true
                });
                const user = await UserModel.findOne({_id : decodedToken.payload.id});
                const inter = user.Notification.filter(object =>{
                    return object._id != req.body.ID;
                })
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
        // Extract token from header
        const token = authHeader && authHeader.split(' ')[1];
                const decodedToken = jwt.decode(token, {
                    complete: true
                });
                const user = await UserModel.findOne({_id : decodedToken.payload.id});
                const student = await StudentModel.findOne({ID: user._id});
                const course = await CourseModel.findOne({_id: req.body.ID})
                const combined = student.CourseEnrolled.concat({id: req.body.ID,progress:[],name: course.Name});
                //console.log(combined,1)
                await StudentModel.findOneAndUpdate({ID: decodedToken.payload.id},{CourseEnrolled: combined}, { useFindAndModify: false })
                var enrol = course.Students
                enrol.push(decodedToken.payload.id)
                await CourseModel.findOneAndUpdate({_id: req.body.ID},{Students: enrol}, { useFindAndModify: false })
                str1 = "New Course Added: "
                str2 = str1.concat(course.Name)
                notifgen(user,str2)
                res.status(200).json({data:"Course Purchased Successfully" });
            } catch(error) {
                //console.log(error)
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
    }

   
}

async function notifgen(user,msg){
    const combined1 = user.Notification.concat({message: msg,timestamp: Date.now()});
    await UserModel.findOneAndUpdate({_id: user._id},{Notification: combined1}, { useFindAndModify: false })
    return 0
}

