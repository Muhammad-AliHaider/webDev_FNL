var mongoose = require('mongoose');


const Schema = mongoose.Schema;

const QuizSchema = new Schema({
    VideoID: {
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
        type: [{question:{
            type: string,
            required:true
             },
            choices:{ 
                type:[string],
                repuired:true
            },
            answer:{
                type: Number,
                required: true
            }}],
        default: undefined    
    },
    CreatedAt: {
        type: Date,
        trim: true,
        default: Date.Now(),  
        required: true
    },
    UpdatedAt: {
        type: Date,
        trim: true,
        default: Date.Now(),  
        required: true
    }

});

QuizSchema.pre('save', function(next){
    next();
});

var quizzes = new mongoose.model('Quiz',QuizSchema);

module.exports = quizzes;