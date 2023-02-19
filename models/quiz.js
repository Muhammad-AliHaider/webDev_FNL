var mongoose = require('mongoose');


const Schema = mongoose.Schema;

const QuizSchema = new Schema({
    CourseID: {
        type: String,
        trim: true,  
        required: true  
    },
    ID: {
        type: String,
        trim: true,  
        required: true  
    },
    Content: {
        Questions : {type : [String], required:true },
        Options : {type: [[String]], required:true},
        Answers : {type : [String], required:true }
    },
    CreatedAt: {
        type: Date,
        trim: true,  
        required: true
    }

});

QuizSchema.pre('save', function(next){
    next();
});

var quizzes = new mongoose.model('Quiz',QuizSchema);

module.exports = quizzes;