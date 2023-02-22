
const UserModel = require('../models/user');
const TeacherModel = require('../models/user');

module.exports = {

    read: async function (req,res){
        {
            try {
                var token = req.cookies.acc;
                const decodedToken = jwt.decode(token, {
                    complete: true
                });
                const user = await UserModel.findOne({_id : decodedToken.payload.id});
                const teacher = await TeacherModel.findOne({ID : decodedToken.payload.id});
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
        await UserModel.findOneAndUpdate({_id : decodedToken.payload.id}, req.body, { useFindAndModify: false }).then(data => {
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
}



