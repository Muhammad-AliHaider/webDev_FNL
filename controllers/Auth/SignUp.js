const bcrypt = require('bcrypt');
const UserModel = require('../../models/user');
const TeacherModel = require('../../models/teacher');
const StudentModel = require('../../models/student');
const Token = require('../../models/token');
const {sendVerificationEmail} = require('../../middlewares/email');



module.exports = {
    create: async function(req, res, next) {
        console.log('hi')
        console.log(req.body)
        if (!(req.body.UserName||req.body.Password||req.body.Name||req.body.Age||req.body.Email||req.body.Role)){
            res.json({status: "failure", message: "Incomplete Information", data: null});
            // next();
        }
        else if(req.body.Role != 3 && req.body.Role != 2 && req.body.Role != 1){
            res.json({status: "failure", message: "Incorrect Role", data: null});
            // next();
        }
        else{
        await UserModel.find({UserName:req.body.Email}). then ( async userInfo => {
            if(userInfo.length == 0){         

                await UserModel.create({ UserName: req.body.UserName, Password: req.body.Password, Name: req.body.Name,Age: req.body.Age,Gender: req.body.Gender,Email: req.body.Email,Role: req.body.Role, Notification:[],ProfilePic : req.body.ProfilePic,BIO: req.body.BIO, CreditCard: {cardNumber: req.body.cardNumber,expirationDate: req.body.expirationDate, securityCode:req.body.securityCode}, CreatedAt: new Date()}, async function (err, result) {
                    
                    if (err){ 
                        console.log(err.message)
                        res.send({status :"failure",message : err.message});
                    }
                    else{
                        if(req.body.Role == "2"){
                            TeacherModel.create({ID: result._id })
                        }
                        else{
                            StudentModel.create({ID: result._id })
                        } 
                        await sendVerificationEmail(result, req, res, true);
                    }  
                });
            }
            else{
                res.status(401).json({success: false, message: "A user with this email already exists", data:{user: userInfo[0]}});
            }
        }).catch(err => {
            res.json({status:"error", message: err, data:null});
        });
        } 

    },
    verify : async (req, res) => {
        if(!req.params.token) return res.status(400).json({message: "We were unable to find a user for this token."});
    
        try {
            // Find a matching token
            const token = await Token.findOne({ token: req.params.token, verify: true });
    
            if (!token) return res.status(400).json({ message: 'We were unable to find a valid token. Your token my have expired.' });
    
            // If we found a token, find a matching user
            User.findOne({ _id: token.userId }, async(err, user) => {
                console.log(user);
                if (!user) return res.status(400).json({ message: 'We were unable to find a user for this token.' });
    
                if (user.isVerified) return res.status(400).json({ message: 'This user has already been verified.' });
    
                // Verify and save the user 
                user.isVerified = true;
                user.save(function (err) {
                    if (err) return res.status(500).json({message:err.message});
    
                    res.status(200).send("The account has been verified. Please log in.");
                });
            });
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    },

};
