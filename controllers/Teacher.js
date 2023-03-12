
const UserModel = require('../models/user');
const TeacherModel = require('../models/teacher');
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
                res.status(200).json({data: user,teacher});
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
        var token = req.cookies.acc;
        const decodedToken = jwt.decode(token, {
            complete: true
            });
            await TeacherModel.findOneAndUpdate({ID: decodedToken.payload.id}, {$push: {CourseOffered: req.body.CourseID}}, { useFindAndModify: false }).then(data => {
                if (data.length == 0) {
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
    remove_courses: async function (req,res){
        var token = req.cookies.acc;
        const decodedToken = jwt.decode(token, {
            complete: true
            });
            await TeacherModel.findOneAndUpdate({ID: decodedToken.payload.id}, {$pull: {CourseOffered: req.body.CourseID}}, { useFindAndModify: false }).then(data => {
                if (data.length == 0) {
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
    }
}



