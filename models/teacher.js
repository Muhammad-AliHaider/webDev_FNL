var mongoose = require('mongoose');


const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
    ID: {
        type: String,
        trim: true,  
        required: true  
    },
    CourseOffered: {
        type: [String],
        trim: true,  
        required: true
    },
});

TeacherSchema.pre('save', function(next){
    next();
});

var teachers = new mongoose.model('Teacher',TeacherSchema);

module.exports = teachers;