const CourseModel = require('../models/course');
const mongoose = require('mongoose');

module.exports = {
    create: async function(req, res, next) {
        if (!(req.body.Name||req.body.Description || req.body.Teacher || req.body.Topic || req.body.Language)){
            res.status(400).json({status: "failure", message: "Incomplete Information", data: null});
        }
        else{
            console.log("yeha say aya hai yeh ",  req.body.Teacher)
            await CourseModel.create({Teacher: req.body.Teacher.toUpperCase() ,Topic: req.body.Topic.toUpperCase(),Language: req.body.Language.toUpperCase(), Name: req.body.Name.toUpperCase(), Description: req.body.Description, CreatedAt:new Date() ,status :true}, function (err, result) {
                if (err){ 
                    console.log(err);
                    res.json({status: "failure", message: "Course not added!!!", data: null});
                }
                else{
                    res.json({status: "success", message: "Course added successfully!!!", data: result});
                }  
            }
            );
        }
    },

    read: async function(req, res, next) {
        console.log(req.query._id)
        if(req.query._id){
            try{
                const ser = await CourseModel.find({_id : req.query._id , status :true}).populate('VideoID').populate('MaterialID').populate('Teacher');
                if(ser.length != 0){
                    res.json({status: "success", message: "Course found!!!", data: ser});
                }
                else{
                    res.json({status: "failure", message: "Course not found!!!", data: null});
                }
            }
            catch(err){
                res.json({status: "failure1", message: "Course not found!!!", data: null});
            }
        }
        else if(req.body.Name){
            try {
                const courses = await CourseModel.find({status :true});
                if(req.body.Name){
                    const inter = courses.filter(object =>{
                        return object.Name.includes((req.body.Name).toUpperCase());
                    })
                    res.status(200).json(inter);
                }
                else{
                    res.status(200).json(courses);
                }
            } catch(error) {
                res.status(404).json({message: error.message});
            }
        }
        else{
            try{
                console.log("yeha aya")
            const ser = await CourseModel.find({ status :true});
            if(ser.length != 0){
                console.log('Course',ser)
                res.json({status: "success", message: "Course found!!!", data: ser});
            }
            else{
                res.status(400).json({status: "failure", message: "Course not found!!!", data: null});
            }}
            catch(err){
                res.status(400).json({status: "failure", message: "Course not found!!!", data: null});
            }
        }

    },

    update:  async function (req,res){
        if(req.body._id){
            await CourseModel.findOneAndUpdate({_id : req.body._id , status :true}, req.body, { useFindAndModify: false }).then(data => {
                if (data.length == 0) {
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
        }
        else{
            res.json({status: "failure", message: "Incomplete Information", data: null});
        }
    },

    destroy: async function (req,res){
        if(req.body._id){
            await  CourseModel.findOneAndUpdate({_id: req.body._id },{ status : false }, { useFindAndModify: false }).then(data => {
                if (data.length == 0) {
                    res.status(404).send({
                        message: `Course not found.`
                    });
                }
                else{
                    res.send({ message: "Course deleted successfully." })
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

    add_video: async function (req,res){
        if(req.body._id){
            await CourseModel.findOneAndUpdate({_id : req.body._id},{ $push: { VideoID: req.body.VideoID } }, { useFindAndModify: false }).then(data => {
                if (data.length == 0) {
                    res.status(404).send({
                        message: `Course not found.`
                    });
                }
                else{
                    res.send({ message: "Video added successfully." })
                }
            }).catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });
            
        }else{
            res.json({status: "failure", message: "ID not given", data: null});
        }
    },

    remove_video: async function (req,res){
        if(req.body._id){
            await CourseModel.findOneAndUpdate({_id : req.body._id},{ $pull: { VideoID: req.body.VideoID } }, { useFindAndModify: false }).then(data => {
                if (data.length == 0) {
                    res.status(404).send({
                        message: `Course not found.`
                    });
                }
                else{
                    res.send({ message: "Video removed successfully." })
                }
            }).catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });

        }else{
            res.json({status: "failure", message: "ID not given", data: null});
        }
    },

    add_material: async function (req,res){
        if(req.body._id){
            
            await CourseModel.findOneAndUpdate({_id : req.body._id , status:true},{ $push: { MaterialID: req.body.MaterialID } }, { useFindAndModify: false }).then(data => {
                if (data.length == 0) {
                    res.status(404).send({
                        message: `Course not found.`
                    });
                }
                else{
                    res.send({ message: "Material added successfully." })
                }
            }).catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });

        }else{
            res.json({status: "failure", message: "ID not given", data: null});
        }
    },

    remove_material: async function (req,res){
        if(req.body._id){

            console.log(req.body.MaterialID)
            
            await CourseModel.findOneAndUpdate({_id : req.body._id},{ $pull: { MaterialID: req.body.MaterialID } }, { useFindAndModify: false }).then(data => {
                if (data.length == 0) {
                    res.status(404).send({
                        message: `Course not found.`
                    });
                }
                else{
                    res.send({ message: "Material removed successfully." })
                }
            }).catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });
            
        }else{
            res.json({status: "failure", message: "ID not given", data: null});
        }
    },

}