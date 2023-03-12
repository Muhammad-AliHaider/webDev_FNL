var mongoose = require('mongoose');


const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    ID: {
        type: String,
        trim: true,  
        required: true  
    },
    CourseEnrolled: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,  
        ref: 'Course'
    },
    Scores: {
        QuizId : {
            type : [mongoose.Schema.Types.ObjectId], 
            ref: 'Quiz'
        },
        Score : {type: Number}
    }

});

StudentSchema.pre('save', function(next){
    next();
});

var students = new mongoose.model('Student',StudentSchema);

module.exports = students;