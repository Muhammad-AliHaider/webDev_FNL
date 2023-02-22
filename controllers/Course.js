const CourseModel = require('../models/user');

module.exports = {
    create: async function(req, res, next) {
        if (!(req.body.Name||req.body.Description||req.body.Thumbnail)){
            res.json({status: "failure", message: "Incomplete Information", data: null});
        }
        const forLength = await CourseModel.find({})[0].CourseID;
        await CourseModel.create({CourseID: forLength+1, Name: req.body.Name, Description: req.body.Description, Thumbnail: req.body.Thumbnail, CreatedAt:new Date() ,VideoID: [], MaterialID: []}, function (err, result) {
            if (err){ 
                next(err);
            }
            else
                res.json({status: "success", message: "Course added successfully!!!", data: null});  
        }
        );
    },

    read: async function(req, res, next) {
        const ser = CourseModel.find({CourseID : req.body.CourseID});
        if(ser != null){
            res.json({status: "success", message: "Course found!!!", data: ser});
        }
        else{
            res.json({status: "failure", message: "Course not found!!!", data: null});
        }

    },

    update:  async function (req,res){
        await CourseModel.findOneAndUpdate({CourseID : req.body.CourseID}, req.body, { useFindAndModify: false }).then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Course not found.`
                });
            }else{
                res.send({ message: "Course updated successfully." })
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    },

    destroy: async function (req,res){
        await  CourseModel.findOneAndRemove({CourseID: req.body.CourseID}, function (err, result) {
            if (err){
                next(err);
            }
            else{
                res.json({status: "success", message: "Course deleted successfully!!!", data: null});
            }
        });
    },

}