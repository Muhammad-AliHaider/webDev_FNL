var mongoose = require('mongoose');


const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    CourseID: {
        type: String,
        trim: true,  
        required: true  ,
        unique: true

    },
    Name: {
        type: String,
        trim: true,  
        required: true
    },
    Thumbnail: {
        type: String,
        trim: true,  
        required: true
    },
    Description: {
        type: String,
        trim: true,  
        required: true  
    },
    VideoID: {
        type: [String],
        trim: true,  
        required: true  
    },
    MaterialID: {
        type: [String],
        trim: true,  
        required: true
    },
    CreatedAt: {
        type: Date,
        trim: true,  
        required: true,
        default: Date.now()
    },
    Students:[{
        studentId:{
            type: string,
            required: true
        },  
        enrolledAt:{
            type: Date,
            default: Date.now()
        }
    }],
    UpdatedAt: {
        type: Date,
        trim: true,  
        required: true,
        default: Date.now()
    },
});

CourseSchema.pre('save', function(next){
    next();
});

var courses = new mongoose.model('Course',CourseSchema);

module.exports = courses;