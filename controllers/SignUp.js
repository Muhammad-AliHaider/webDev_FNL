const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const TeacherModel = require('../models/teacher');
const StudentModel = require('../models/student');
const jwt = require('jsonwebtoken');



module.exports = {
    create: async function(req, res, next) {
        if (!(req.body.UserName||req.body.Password||req.body.Name||req.body.Age||req.body.Email||req.body.Role||req.body.CreditCard)){
            res.json({status: "failure", message: "Incomplete Information", data: null});
        }
        console.log(req.body.Role);
        if(req.body.Role != 3 && req.body.Role != 2 && req.body.Role != 1){
            res.json({status: "failure", message: "Incorrect Role", data: null});
        }
        UserModel.create({ UserName: req.body.UserName, Password: req.body.Password, Name: req.body.Name,Age: req.body.Age,Gender: req.body.Gender,Email: req.body.Email,Role: req.body.Role, CourseOffered: [], CourseEnrolled: [], Notification:[],ProfilePic : req.body.ProfilePic,BIO: req.body.BIO, CreditCard: {cardNumber: req.body.cardNumber,expirationDate: req.body.expirationDate, securityCode:req.body.securityCode}, CreatedAt: new Date()}, async function (err, result) {

            if (err){ 
                next(err);
            }
            else
                if(req.body.Role == 2){
                    TeacherModel.create({ID: result._id , CourseOffered : []})
                }
                else{
                    StudentModel.create({ID: result._id , CourseEnrolled : []})
                }
                res.json({status: "success", message: "User added successfully!!!", data: null});  
        });
    },

}