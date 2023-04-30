var mongoose = require('mongoose');


const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
    ID: {
        type: String,
        trim: true,  
        required: true  
    },
    CourseOffered: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Course'
    },
    CreatedAt: {
        type: Date,
        trim: true,
        default: Date.now(),
        required: true
    },
    UpdatedAt: {
        type: Date,
        trim: true,
        default: Date.now(),
        required: true
    },
    status :{
        type: Boolean,
        default: true,
        required: true,
    }
});

TeacherSchema.pre('save', function(next){
    next();
});

var teachers = new mongoose.model('Teacher',TeacherSchema);

module.exports = teachers;