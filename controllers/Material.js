const MaterialModel = require('../models/material');

module.exports = {
    create: function(req, res, next) {
        if (!(req.body.Name||req.body.URL)){
            res.json({status: "failure", message: "Incomplete Information", data: null});
        }
        else{
        MaterialModel.create({ Name: req.body.Name, URL: req.body.URL, CreatedAt:new Date() }, function (err, result) {
            if (err){ 
                res.send({ message: err.message })
            }
            else
                res.json({status: "success", message: "Course added successfully!!!", data: null});  
        }
        );
        }
    },

    read: async function(req, res, next) {
        if(req.body._id){
            try{
            const ser = await MaterialModel.find({_id : req.body._id});
            // console.log(ser);
            if(ser.length != 0){
                res.json({status: "success", message: "Material found!!!", data: ser});
            }
            else{
                res.json({status: "failure", message: "Material not found!!!", data: null});
            }}
            catch(err){
                res.send({ message: err.message })
            }
        }
        else{
            try{
            const ser = await MaterialModel.find({});
            if(ser != null){
                res.json({status: "success", message: "Material found!!!", data: ser});
            }
            else{
                res.json({status: "failure", message: "Material not found!!!", data: null});
            }}
            catch(err){
                res.send({ message: err.message })
            }
        }
    },

    update: async function(req, res, next) {
        if(req.body._id){
            await MaterialModel.findOneAndUpdate({_id: req.body._id}, req.body , { useFindAndModify: false }).then(data => {
                if (!data) {
                    res.status(404).send({
                        message: `Material not found.`
                    });
                }else{
                    res.send({ message: "Material updated successfully." })
                }
            }
            ).catch(err => {
                res.status(500).send({
                    message: err.message
                });
            });
        }
        else
        {
            res.json({status: "failure", message: "ID not given", data: null});
        }
    },

    destroy : async function(req, res, next) {
        if(req.body._id){
            await MaterialModel.findOneAndRemove({_id: req.body._id}, { useFindAndModify: false }).then(data =>{
                if (!data) {
                    res.status(404).send({
                        message: `Material not found.`
                    });
                }else{
                    res.send({ message: "Material deleted successfully." })
                }
            }).catch(err => {
                res.status(500).send({
                    message: err.message
                });
            }); 
        }
        else{
            res.json({status: "failure", message: "ID not given", data: null});
        }
    }
}