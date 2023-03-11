const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const StudentModel = require('../models/student');
const CourseModel = require('../models/course');
const jwt = require('jsonwebtoken');



module.exports = {    
    read: async function (req,res){
        {
            try {
                var token = req.cookies.acc;
                const decodedToken = jwt.decode(token, {
                    complete: true
                });
                const user = await UserModel.findOne({_id : decodedToken.payload.id});
                const std = await StudentModel.findOne({ID : decodedToken.payload.id});
                res.status(200).json({data: user,std});
            } catch(error) {
                res.status(404).json({message: error.message});
            }
        };
    },

    update : async function (req,res){
        var token = req.cookies.acc;
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
    var token = req.cookies.acc;
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


    get_course: async function (req,res){
        await CourseModel.findOne({CourseID: req.body.CourseID}, { useFindAndModify: false }).then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Course not found.`
                });
            }else{
                res.status(200).json({data: data});
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    },

    get_courses: async function (req,res){
        {
            try {
                const courses = await CourseModel.find();
                res.status(200).json(courses);
            } catch(error) {
                res.status(404).json({message: error.message});
            }
        };
    },

    notifget: async function (req,res){
        {
            try {
                var token = req.cookies.acc;
                const decodedToken = jwt.decode(token, {
                    complete: true
                });
                const user = await UserModel.findOne({_id : decodedToken.payload.id});
                res.status(200).json({data: user.Notification});
            } catch(error) {
                res.status(404).json({message: error.message});
            }
        };
    },

    notifdel: async function (req,res){
        {
            try {
                var token = req.cookies.acc;
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
                var token = req.cookies.acc;
                const decodedToken = jwt.decode(token, {
                    complete: true
                });
                const user = await UserModel.findOne({_id : decodedToken.payload.id});
                const student = await StudentModel.findOne({ID: user._id});
                const combined = student.CourseEnrolled.concat({id: req.body.ID,progress:0});
                await StudentModel.findOneAndUpdate({ID: decodedToken.payload.id},{CourseEnrolled: combined}, { useFindAndModify: false })
                const course = await CourseModel.findOne({CourseID: req.body.ID})
                str1 = "New Course Added: "
                str2 = str1.concat(course.Name)
                const combined1 = user.Notification.concat({message: str2,timestamp: Date.now()});
                await UserModel.findOneAndUpdate({_id: decodedToken.payload.id},{Notification: combined1}, { useFindAndModify: false })
                res.status(200).json({data:"Course Purchased Successfully" });
            } catch(error) {
                res.status(404).json({message: error.message});
            }
        };
    },


}

async function notifgen(msg,time,id) {
    try {
        var token = req.cookies.acc;
        const decodedToken = jwt.decode(token, {
            complete: true
        });
        const course = await CourseModel.findOne({CourseID: id})
        str2 = msg.concat(course.Name)
        const combined = user.Notification.concat({message: str2,timestamp: time});
        await UserModel.findOneAndUpdate({_id: decodedToken.payload.id},{Notification: combined}, { useFindAndModify: false })
        return 0
    } catch(error) {
    }
}
