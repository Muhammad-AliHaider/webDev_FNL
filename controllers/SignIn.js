const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');



module.exports = {
    authenticate: function(req, res, next) {
        UserModel.findOne({UserName:req.body.UserName}, function(err, userInfo){
            if (err) {
             next(err);
            } else {
                if(bcrypt.compareSync(req.body.Password, userInfo.Password)) {
                    const token = jwt.sign({id: userInfo._id,role: userInfo.Role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '300s' },{data: new Date().getTime()/1000});
                    const rtoken = jwt.sign({id: userInfo._id,role: userInfo.Role}, process.env.REFRESH_TOKEN_SECRET , { expiresIn: '7d' },{data: new Date().getTime()}/1000);
                    res.cookie('jwt', rtoken, { httpOnly: true, 
                     });
                    res.cookie('acc', token, { httpOnly: true, 
                     });
                    res.json({status:"success", message: "user found!!!", data:{user: userInfo, token:token}});
                }else{
                    res.json({status:"error", message: "Invalid UserName/password!!!", data:null});
                }
            }
        });
    },
}