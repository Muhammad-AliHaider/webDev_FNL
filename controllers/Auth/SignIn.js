const bcrypt = require('bcrypt');
const UserModel = require('../../models/user');
const jwt = require('jsonwebtoken');



module.exports = {
    authenticate: async function(req, res, next) {
        if((req.body.UserName && req.body.Password)){
            console.log(req.body.UserName , req.body.Password)
        await UserModel.find({UserName:req.body.UserName}). then(userInfo => {
            if(userInfo.length == 0){
                res.status(404).json({status:"error", message: "Invalid UserName!!!", data:null});
            }
            else{
                console.log(req.body.Password, userInfo[0].Password)
                if(req.body.Password == userInfo[0].Password) {
                    if (!userInfo[0].isVerified) return res.status(401).json({ type: 'not-verified', message: 'Your account has not been verified.' });
                    const token = jwt.sign({id: userInfo[0]._id,role: userInfo[0].Role}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '300s' },{data: new Date().getTime()/1000});
                    const rtoken = jwt.sign({id: userInfo[0]._id,role: userInfo[0].Role}, process.env.REFRESH_TOKEN_SECRET , { expiresIn: '7d' },{data: new Date().getTime()}/1000);
                    res.cookie('jwt', rtoken, { httpOnly: true, 
                     });
                    res.cookie('acc', token, { httpOnly: true, 
                     });
                     console.log(token)
                     res.status(200).json({status:"success", message: "user found!!!", data:{user: userInfo[0], token:token}});
                }else{
                    console.log('glt')
                    res.status(404).json({status:"failure", message: "Invalid password!!!", data:null});
                }
            }
        }).catch(err => {
            res.status(404).json({status:"error", message: err, data:null});
        });
        }
        else{
            res.status(404).json({status:"error", message: "Incomplete Info", data:null});
        }
    },

}