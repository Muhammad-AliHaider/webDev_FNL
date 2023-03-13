
const UserModel = require('../models/user');



module.exports = {
    create: function(req, res, next) {
        if (!(req.body.UserName||req.body.Password||req.body.Name||req.body.Age||req.body.Email||req.body.Role||req.body.CreditCard)){
            res.json({status: "failure", message: "Incomplete Information", data: null});
        }
        if(req.body.Role != 3 && req.body.Role != 2){
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
    
    read: async function (req,res){
        {
            try {
                const user = await UserModel.find();
                res.status(200).json(user);
            } catch(error) {
                res.status(404).json({message: error.message});
            }
        };
    },

    update : async function (req,res){
    

        
        await UserModel.findOneAndUpdate({UserName: req.body.UserName}, req.body, { useFindAndModify: false }).then(data => {
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
    await UserModel.findOneAndRemove({UserName: req.body.UserName}).then(data => {
        if (!data) {
          res.status(404).send({
            message: `User not found.`
          });
        } else {
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

   
}



