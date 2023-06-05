const QuizModel = require('../models/quiz');
// const mongoose = require('mongoose');
// const mongo = require('mongodb')
// const Quiz_Card = require('../models/quiz_card');

module.exports = {
    create: async function(req, res, next) {
        
        await QuizModel.create({Name: req.body.Name,CreatedAt: new Date()} , function (err, result) {
            if (err){ 
                console.log(err);
                res.json({status: "failure", message: "Quiz not added!!!", data: null});
            }
            else
                res.json({status: "success", message: "Quiz added successfully!!!", data: null});  
        }
        );
    },
    
    

    read : async function(req, res, next) {
        if(!req.query._id){
        try{
            const ser = await QuizModel.find({status:true}).populate('Quiz_card');
            console.log(ser);
            if(ser.length != 0){
                res.json({status: "success", message: "Quiz found!!!", data: ser});
            }
            else{
                res.json({status: "failure", message: "Quiz not found!!!", data: null});
            }
        }
        catch(err){
            res.json({status: "failure", message: "Quiz not found!!!", data: null});
        }
        }
        else{
            try{
            const ser = await QuizModel.find({_id:req.query._id}).populate('Quiz_card');
            if(ser.length != 0){
                res.json({status: "success", message: "Quiz found!!!", data: ser});
            }
            else{
                res.json({status: "failure", message: "Quiz not found!!!", data: null});
            }}
            catch(err){
                res.json({status: "failure", message: "Quiz not found!!!", data: null});
            }
        }
    },

    destroy : async function(req, res, next) {
        console.log(req.body.ID);
        if(!req.body.ID){
            res.status(406).send({
                message: `Quiz id not given.`
            });
        }
        else{
            await QuizModel.findOneAndUpdate({_id:req.body.ID},{status : false},{useFindAndModify : false}).then(data => {
                if (data.length == 0) {
                    res.status(406).send({
                        message: `Quiz not found.`
                    });
                }else{
                    res.send({ message: "Quiz deleted successfully." })
                }
            }).catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });
        }
    },

    add_content : async function(req, res, next) {
        if (!(req.body._id || req.body.Card_ID)){
            res.json({status: "failure", message: "Incomplete Information", data: null});
        }
        else{
            await QuizModel.findOneAndUpdate({_id : req.body._id},{$push: {Quiz_card: req.body.Card_ID}}, { useFindAndModify: false }).then(data => {
                if (!data) {
                    res.status(404).send({
                        message: `Quiz not found.`
                    });
                }else{
                    res.send({ message: "Quiz card added successfully." })
                }
            }).catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });
        }
    },

    remove_content : async function(req, res, next) {
        if(!req.body.Card_ID){
            res.send({ message: "Card_ID not given." });
        }
        else{
            await QuizModel.findOneAndUpdate({_id : req.body._id},{$pull: {Quiz_card: req.body.Card_ID}}, {useFindAndModify : false}).then(data => {
                // console.log(data);
                if (data.length == 0) {
                    res.status(404).send({
                        message: `Quiz not found.`
                    });
                }else{
                    
                    res.send({ message: "Quiz card removed successfully." , data_ : data })
                }
            }).catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });
        }
    }

}

