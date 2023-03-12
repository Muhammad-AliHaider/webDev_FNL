const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const StudentModel = require('../models/student');
const CourseModel = require('../models/course');
const VideoModel = require('../models/video');
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

        if(req.body.Password){
            req.body.Password = await bcrypt.hashSync(req.body.Password, 10);
        }
    
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
                notifgen(user,str2)
                res.status(200).json({data:"Course Purchased Successfully" });
            } catch(error) {
                res.status(404).json({message: error.message});
            }
        };
    },

    coursedelete: async function (req,res){
        {
            try {
                var token = req.cookies.acc;
                const decodedToken = jwt.decode(token, {
                    complete: true
                });
                const user = await UserModel.findOne({_id : decodedToken.payload.id});
                const student =  await StudentModel.findOne({ID : decodedToken.payload.id});
                const inter = student.CourseEnrolled.filter(object =>{
                    return object.id != req.body.ID;
                })
                await StudentModel.findOneAndUpdate({ID: decodedToken.payload.id},{CourseEnrolled: inter}, { useFindAndModify: false })
                const course = await CourseModel.findOne({CourseID: req.body.ID})
                str1 = "Course Deleted: "
                str2 = str1.concat(course.Name)
                notifgen(user,str2)
                res.status(200).json({data:"Course Deleted Successfully" });
            } catch(error) {
                res.status(404).json({message: error.message});
            }
        };
    },

    get_videos: async function (req,res){
        {
            try {
                const videos = await VideoModel.find();
                res.status(200).json(videos);
            } catch(error) {
                res.status(404).json({message: error.message});
            }
        };
    },

    get_video: async function (req,res){
        await VideoModel.findOne({ID: req.body.VideoID}, { useFindAndModify: false }).then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Video not found.`
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

    selectcourse: async function (req,res){
        {
            try {
                const courses = await CourseModel.find();
                if(req.body.Name){
                    const inter = courses.filter(object =>{
                        return object.Name.includes(req.body.Name);
                    })
                    res.status(200).json(inter);
                }
                else{
                    res.status(200).json(courses);
                }
            } catch(error) {
                res.status(404).json({message: error.message});
            }
        };
    },
   
}

async function notifgen(user,msg){
    const combined1 = user.Notification.concat({message: msg,timestamp: Date.now()});
    await UserModel.findOneAndUpdate({_id: user._id},{Notification: combined1}, { useFindAndModify: false })
    return 0
}