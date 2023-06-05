
const UserModel = require('../models/user');
const TeacherModel = require('../models/teacher');
const CourseModel = require('../models/course');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
                const teacher = await TeacherModel.findOne({ID : decodedToken.payload.id}).populate('CourseOffered');
                if(user!= null && teacher!= null){
                console.log(res.getHeaders("access"));
                res.status(200).json({Header: res.getHeaders("access"),data: {user,teacher}});}
                else
                res.status(404).json({message: "User not found."});
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
 


UserModel.findOne({ _id: decodedToken.payload.id })
  .then(user => {
    if (!user) {
      res.status(404).send({
        message: `User not found.`
      });
      return;
    }
    console.log(user);

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
        try {
    const authHeader = req.headers['authorization'];
        // Extract token from header
        const token = authHeader && authHeader.split(' ')[1];
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
        if(req.body.CourseID , req.body.Teacher_Id){
        
            await TeacherModel.findOneAndUpdate({ID: req.body.Teacher_Id}, {$push: {CourseOffered: req.body.CourseID}}, { useFindAndModify: false }).then(async data => {
                if (data == null) {
                    res.status(404).send({
                        message: `User not found.`
                    });
                }else{
                    const user = await UserModel.findOne({_id: req.body.Teacher_Id}).catch(err => {console.log("error yeha aya hai")})
                    const course = await CourseModel.findOne({_id: req.body.CourseID}).catch(err => {console.log("error yeha aya hai")})
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
        if(req.body.CourseID , req.body.Teacher_Id){
            await TeacherModel.findOneAndUpdate({ID: req.body.Teacher_Id}, {$pull: {CourseOffered: req.body.CourseID}}, { useFindAndModify: false }).then(async data => {
                if (data.length == 0) {
                    res.status(404).send({
                        message: `User not found.`
                    });
                }else{
                    const course = await CourseModel.findOne({_id: req.body.CourseID})
                    str1 = "Course Deleted: "
                    str2 = str1.concat(course.Name)
                    user = await UserModel.findOne({_id: req.body.Teacher_Id})
                    notifgen(user,str2)
                    res.send({ message: "Course  Removed successfully." })
                }
            }).catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });
        }
        else{
            res.status(500).send({
                message: "Course ID not provided"
            });
        }
    },

    notifget: async function (req,res){
        {
            try {
                const authHeader = req.headers['authorization'];
        // Extract token from header
        const token = authHeader && authHeader.split(' ')[1];
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


}

async function notifgen(user,msg){
    const combined1 = user.Notification.concat({message: msg,timestamp: Date.now()});
    await UserModel.findOneAndUpdate({_id: user._id},{Notification: combined1}, { useFindAndModify: false })
    return 0
}



