const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');



module.exports = {
    create: function(req, res, next) {
        if (!(req.body.UserName||req.body.Password||req.body.Name||req.body.Age||req.body.Email||req.body.Role||req.body.CreditCard)){
            res.json({status: "failure", message: "Incomplete Information", data: null});
        }
        console.log(req.body.Role);
        if(req.body.Role != 3 && req.body.Role != 2 && req.body.Role != 1){
            res.json({status: "failure", message: "Incorrect Role", data: null});
        }
        UserModel.create({ UserName: req.body.UserName, Password: req.body.Password, Name: req.body.Name,Age: req.body.Age,Gender: req.body.Gender,Email: req.body.Email,Role: req.body.Role, CourseOffered: [], CourseEnrolled: [], Notification:[],ProfilePic : req.body.ProfilePic,BIO: req.body.BIO, CreditCard: req.body.CreditCard, CreatedAt: new Date()}, function (err, result) {
            if (err){ 
                next(err);
            }
            else
                res.json({status: "success", message: "User added successfully!!!", data: null});  
        });
    },

}