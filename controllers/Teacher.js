
const UserModel = require('../models/user');
const TeacherModel = require('../models/teacher');
const CourseModel = require('../models/course');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {

    read: async function (req,res){
        {
            try {
                var token = req.cookies.acc;
                const decodedToken = jwt.decode(token, {
                    complete: true
                });
                const user = await UserModel.findOne({_id : decodedToken.payload.id});
                const teacher = await TeacherModel.findOne({ID : decodedToken.payload.id}).populate('CourseOffered');
                if(user!= null && teacher!= null)
                res.status(200).json({data: user,teacher});
                else
                res.status(404).json({message: "User not found."});
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

        await UserModel.findOneAndUpdate({_id : decodedToken.payload.id}, req.body, { useFindAndModify: true }).then(data => {
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
        try {
    var token = req.cookies.acc;
    const decodedToken = jwt.decode(token, {
        complete: true
    });
    await TeacherModel.findOneAndRemove({ID: decodedToken.payload.id})
    await UserModel.findOneAndRemove({_id: decodedToken.payload.id})
    res.status(200).json({message: "User deleted successfully."});
    } catch{
        res.status(404).send({
            message: `User not found.`
          });
    }
    },

    add_courses: async function (req,res){
        if(req.body.CourseID){
        var token = req.cookies.acc;
        const decodedToken = jwt.decode(token, {
            complete: true
            });
            await TeacherModel.findOneAndUpdate({ID: decodedToken.payload.id}, {$push: {CourseOffered: req.body.CourseID}}, { useFindAndModify: false }).then(async data => {
                if (data == null) {
                    res.status(404).send({
                        message: `User not found.`
                    });
                }else{
                    const user = await UserModel.findOne({_id: decodedToken.payload.id})
                    const course = await CourseModel.findOne({_id: req.body.CourseID})
                    str1 = "New Course Added: "
                    str2 = str1.concat(course.Name)
                    notifgen(user,str2)
                    res.send({ message: "User updated successfully." })
                }
            }).catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });}
            else{
                res.status(500).send({
                    message: "Course ID not provided"
                });
            }
    },
    remove_courses: async function (req,res){
        var token = req.cookies.acc;
        const decodedToken = jwt.decode(token, {
            complete: true
            });
            await TeacherModel.findOneAndUpdate({ID: decodedToken.payload.id}, {$pull: {CourseOffered: req.body.CourseID}}, { useFindAndModify: false }).then(async data => {
                if (data.length == 0) {
                    res.status(404).send({
                        message: `User not found.`
                    });
                }else{
                    const course = await CourseModel.findOne({_id: req.body.ID})
                    str1 = "Course Deleted: "
                    str2 = str1.concat(course.Name)
                    notifgen(user,str2)
                    res.send({ message: "User updated successfully." })
                }
            }).catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });
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


}

async function notifgen(user,msg){
    const combined1 = user.Notification.concat({message: msg,timestamp: Date.now()});
    await UserModel.findOneAndUpdate({_id: user._id},{Notification: combined1}, { useFindAndModify: false })
    return 0
}



