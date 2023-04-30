var mongoose = require('mongoose');


const Schema = mongoose.Schema;

const QuizSchema = new Schema({
    Name: {
        type: String,
        trim: true,  
        required: true
    },
    Quiz_card: {
        // index: { unique: true, sparse: true },
        type : [mongoose.Schema.Types.ObjectId], 
        ref: 'Quiz_Card'
    },
    CreatedAt: {
        type: Date,
        trim: true,
        default: new Date(),  
        required: true
    },
    UpdatedAt: {
        type: Date,
        trim: true,
        default: new Date(),  
        required: true
    },
    status :{
        type: Boolean,
        default: true,
        required: true,
    }

});

QuizSchema.pre('save', function(next){
    next();
});

var quizzes = new mongoose.model('Quiz',QuizSchema);

module.exports = quizzes;