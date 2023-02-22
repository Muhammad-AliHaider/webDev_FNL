const VideoModel = require('../models/user');

module.exports = {
    create: async function(req, res, next) {
        if (!(req.body.CourseID||req.body.Name||req.body.Thumbnail)){
            res.json({status: "failure", message: "Incomplete Information", data: null});
        }
        const forLength = await VideoModel.find({})[0].ID;
        await VideoModel.create({CourseID: req.body.CourseID, ID: forLength, Name: req.body.Name, Thumbnail: req.body.Thumbnail, CreatedAt:new Date() ,QuizID: []}, function (err, result) {
            if (err){ 
                next(err);
            }
            else
                res.json({status: "success", message: "Course added successfully!!!", data: null});  
        }
        );
    },

    read: async function(req, res, next) {
        const ser = VideoModel.find({VideoID : req.body.VideoID});
        if(ser != null){
            res.json({status: "success", message: "Video found!!!", data: ser});
        }
        else{
            res.json({status: "failure", message: "Video not found!!!", data: null});
        }

    },

    update:  async function (req,res){
        await VideoModel.findOneAndUpdate({VideoID : req.body.VideoID}, req.body, { useFindAndModify: false }).then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Video not found.`
                });
            }else{
                res.send({ message: "Video updated successfully." })
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
    },

    destroy: async function (req,res){
        await  VideoModel.findOneAndRemove({VideoID: req.body.VideoID}, function (err, result) {
            if (err){
                next(err);
            }
            else{
                res.json({status: "success", message: "Video deleted successfully!!!", data: null});
            }
        });
    },

}