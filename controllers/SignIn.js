const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');



module.exports = {
    authenticate: async function(req, res, next) {
        if((req.body.UserName && req.body.Password)){
        await UserModel.find({UserName:req.body.UserName}). then(userInfo => {
            if(userInfo.length == 0){
                res.json({status:"error", message: "Invalid UserName/password!!!", data:null});
            }
            else{
                // console.log(userInfo)
                if(bcrypt.compareSync(req.body.Password, userInfo[0].Password)) {
                    const token = jwt.sign({id: userInfo[0]._id,role: userInfo[0].Role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '300s' },{data: new Date().getTime()/1000});
                    const rtoken = jwt.sign({id: userInfo[0]._id,role: userInfo[0].Role}, process.env.REFRESH_TOKEN_SECRET , { expiresIn: '7d' },{data: new Date().getTime()}/1000);
                    res.cookie('jwt', rtoken, { httpOnly: true, 
                     });
                    res.cookie('acc', token, { httpOnly: true, 
                     });
                    res.json({status:"success", message: "user found!!!", data:{user: userInfo[0], token:token}});
                }else{
                    res.json({status:"error", message: "Invalid UserName/password!!!", data:null});
                }
            }
        }).catch(err => {
            res.json({status:"error", message: err, data:null});
        });
        }
        else{
            res.json({status:"error", message: "Incomplete Info", data:null});
        }
    },

    forget_pass: async function(req, res, next) {
        if((req.body.Email)){
            await UserModel.find({UserName:req.body.UserName}). then(userInfo => {
                if(userInfo.length == 0){
                    res.json({status:"error", message: "Invalid UserName/password!!!", data:null});
                }
                else{
                    // send otp to email
                    res.json({status:"success", message: "user found!!! email send", data:{user: userInfo[0]}});
                }
            }).catch(err => {
                res.json({status:"error", message: err, data:null});
            });
        }
        else {
            res.json({status:"error", message: "incomplete info", data:null});
        }
    }

}