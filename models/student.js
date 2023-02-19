var mongoose = require('mongoose');


const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    ID: {
        type: String,
        trim: true,  
        required: true  
    },
    CourseEnrolled: {
        type: [String],
        trim: true,  
    },
    Scores: {
        QuizId : {type : String, required:true },
        Score : {type: Number, required:true}
    }

});

StudentSchema.pre('save', function(next){
    next();
});

var students = new mongoose.model('Student',UserSchema);

module.exports = students;