const VideoModel = require('../models/video');

module.exports = {
    create: async function(req, res, next) {
        if (!(req.body.Name && req.body.Thumbnail && req.body.URL)){
            res.json({status: "failure", message: "Incomplete Information", data: null});
        };
        await VideoModel.create({ Name: req.body.Name.toUpperCase(), Thumbnail: req.body.Thumbnail , URL : req.body.URL, CreatedAt:new Date() , status : true }, function (err, result) {
            if (err){ 
                next(err);
            }
            else
                res.json({status: "success", message: "video added successfully!!!", data: null});  
        }
        );
    },

    read: async function(req, res, next) {
        if(req.body._id){
            try{
            const ser = await VideoModel.find({_id : req.body._id, status : true}).populate('QuizID');
            if(ser.length != 0){
                res.json({status: "success", message: "Video found!!!", data: ser});
            }
            else{
                res.json({status: "failure", message: "Video not found!!!", data: null});
            }}
            catch(err){
                res.json({status: "failure", message: "Video not found!!!", data: null});
            }
        }
        else if(req.body.Name){
            try {
                const videos = await VideoModel.find({status : true}).populate('QuizID');
                if(req.body.Name){
                    const inter = videos.filter(object =>{
                        return object.Name.includes((req.body.Name).toUpperCase());
                    })
                    res.status(200).json(inter);
                }
                else{
                    res.status(200).json(videos);
                }
            } catch(error) {
                res.status(404).json({message: error.message});
            }
        }
        else{
            try{
                const ser =await VideoModel.find({status : true}).populate('QuizID');
                if(ser.length != 0){
                    res.json({status: "success", message: "Video found!!!", data: ser});
                }
                else{
                    res.json({status: "failure", message: "Video not found!!!", data: null});
                }   
            }
            catch(err){
                res.json({status: "failure", message: "Video not found!!!", data: null});
            }
        }

    },

    update:  async function (req,res){
        if((req.body._id)){
        await VideoModel.findOneAndUpdate({_id : req.body._id , status : true}, req.body, { useFindAndModify: false }).then(data => {
            if (data.length == 0) {
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
        }
        else{
            res.json({status: "failure", message: "Incomplete Information", data: null});
        }
    },

    destroy: async function (req,res){
        if(!(req.body._id)){
            res.json({status: "failure", message: "Incomplete Information", data: null});
        }
        else{
        await  VideoModel.findOneAndUpdate({_id: req.body._id} , {status : false} , { useFindAndModify: false }).then(data => {
            if (data.length == 0) {
                res.status(404).send({
                    message: `Video not found.`
                });
            }else{
                res.send({ message: "Video deleted successfully." })
            }
        }).catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
        }
    },

    add_quiz : async function(req,res){
        if(!(req.body._id&&req.body.QuizID)){
            res.json({status: "failure", message: "Incomplete Information", data: null});
        }
        else{
        await VideoModel.findOneAndUpdate({_id : req.body._id  ,status : true}, {QuizID: req.body.QuizID}, { useFindAndModify: false }).then(data => {
            if (data.length == 0) {
                res.status(404).send({
                    message: 'Video not found.'
                });
            }else{
                res.status(200).send({ message: "Video updated successfully." })
            }
        }
        ).catch(err => {
            res.status(500).send({
                message: err.message
            });
        }
        );
        }
    },

    remove_quiz: async function(req,res){
        if(!(req.body._id&&req.body.QuizID)){
            res.status(406).json({status: "failure", message: "Incomplete Information", data: null});
        }
        else{
        await VideoModel.findOneAndUpdate({_id : req.body._id ,QuizID: req.body.QuizID}, {QuizID: null}, { useFindAndModify: false }).then(data => {
            if (data.length == 0) {
                res.status(406).send({
                    message: `Video not found.`
                });
            }else{
                res.send({ message: "Video updated successfully." })
            }
        }
        ).catch(err => {
            res.status(500).send({
                message: err.message
            });
        }
        );}
    }

}