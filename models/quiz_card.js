var mongoose = require('mongoose');


const Schema = mongoose.Schema;

const CardSchema = new Schema({
    
    Question : {type : String, required:true },
    Options : {type: [String], required:true},
    Answer : {type : String, required:true },
    CreatedAt: {
        type: Date,
        trim: true,  
        required: true
    },
    status :{
        type: Boolean,
        default: true,
        required: true,
    }

});

CardSchema.pre('save', function(next){
    next();
});

var quiz_card = new mongoose.model('Quiz_Card',CardSchema);

module.exports = quiz_card;