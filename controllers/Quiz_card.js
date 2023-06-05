const Quiz_Card = require('../models/quiz_card');

module.exports = {
    create: async function(req, res, next) {
        if (!(req.body.Questions||req.body.Options||req.body.Answers)){
            res.json({status: "failure", message: "Incomplete Information", data: null});
        }
        else{
            console.log(req.body.Question, req.body.Options, req.body.Answer);

            await Quiz_Card.create({Question: req.body.Question, Options: req.body.Options,status: true ,Answer: req.body.Answer, CreatedAt: new Date()}, function (err, result) {
                if (err){
                    console.log(err);
                    res.json({status: "failure", message: "Quiz Card not added!!!", data: null});
                }
                else{
                    res.json({status: "success", message: "Quiz Card added successfully!!!", data: result});
                }
            }
            );
        }
    },
    read : async function(req, res, next) {
        if(!req.body._id){
            try{
                const ser = await Quiz_Card.find({});
                if(ser != null){
                    res.json({status: "success", message: "Quiz_Card found!!!", data: ser});
                }
                else{
                    res.json({status: "failure", message: "Quiz_Card not found!!!", data: null});
                }}
                catch(err){
                    res.send({ message: err.message })
                }
        }
        else{
            try{
            await Quiz_Card.find({_id: req.body._id}).then(data => {
                if(data.length == 0){
                    res.json({status: "failure", message: "Quiz Card not found!!!", data: null});
                }
                else{
                    res.json({status: "success", message: "Quiz Card found!!!", data: data});
                }
            }); 
        }
        catch(err){
            res.json({status: "failure", message: "Quiz Card not found!!!", data: null});
        }
        }        
    },

    destroy : async function(req, res, next) {
        if(!req.body._id){
            res.json({status: "failure", message: "Incomplete Information", data: null});
        }
        else{
            try{
            await Quiz_Card.findOneAndRemove({_id:req.body._id}).then(data => {
                if (data.length == 0) {
                    res.json({status: "failure", message: "Quiz Card not found!!!", data: null});
                }else{
                    res.json({status: "success", message: "Quiz Card deleted successfully!!!", data: data});
                }
            });}
            catch(err){
                res.json({status: "failure", message: "Quiz Card not found!!!", data: null});
            }
        }
    },

    update : async function(req, res, next) {
        if(!req.body._id){
            res.json({status: "failure", message: "Incomplete Information", data: null});
        }
        else{
            try{
            await Quiz_Card.findOneAndUpdate({_id : req.body._id}, req.body, {useFindAndModify : false }).then(data => {
                if (data.length == 0) {
                    res.json({status: "failure", message: "Quiz Card not found!!!", data: null});
                }else{
                    res.json({status: "success", message: "Quiz Card updated successfully!!!", data: data});
                }
            });}
            catch(err){
                res.json({status: "failure", message: "Quiz Card not found!!!", data: null});
            }
        }
    },

    add_options : async function(req, res, next) {
        if(!req.body._id){
            res.json({status: "failure", message: "Incomplete Information", data: null});
        }
        else{
            try{
            await Quiz_Card.findOneAndUpdate({_id : req.body._id}, {$push: {Options: req.body.Options}}, {useFindAndModify : false }).then(data => {
                if (data.length == 0) {
                    res.json({status: "failure", message: "Quiz Card not found!!!", data: null});
                }else{
                    res.json({status: "success", message: "Quiz Card updated successfully!!!", data: data});
                }
            });
            }
            catch(err){
                res.json({status: "failure", message: "Quiz Card not found!!!", data: null});
            }
        }
    },

    remove_options : async function(req, res, next) {
        if(!req.body._id){
            res.json({status: "failure", message: "Incomplete Information", data: null});
        }
        else{
            try{
            await Quiz_Card.findOneAndUpdate({_id : req.body._id}, {$pull: {Options: req.body.Options}}, {useFindAndModify : false }).then(data => {
                if (data.length == 0) {
                    res.json({status: "failure", message: "Quiz Card not found!!!", data: null});
                }else{
                    res.json({status: "success", message: "Quiz Card updated successfully!!!", data: data});
                }
            });
            }
            catch(err){
                res.json({status: "failure", message: "Quiz Card not found!!!", data: null});
            }
        }
    },

}