var mongoose = require('mongoose');


const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    Name: {
        type: String,
        trim: true,  
        required: true
    },
    Language: {
        type: String,
        trim: true,  
        required: true
    },
    Topic: {
        type: String,
        trim: true,  
        required: true
    },
    Teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        trim: true,  
        required: true
    },
    Thumbnail: {
        type: String,
        trim: true,  
        required: false
    },
    Price: {
        type: String,
        trim: true,  
        required: false //until further notice
    },
    Description: {
        type: String,
        trim: true,  
        required: true  
    },
    VideoID: {
        type: [mongoose.Schema.Types.ObjectId],  
        ref: 'Video' 
    },
    MaterialID: {
        type: [mongoose.Schema.Types.ObjectId],  
        ref: 'Material'
    },
    CreatedAt: {
        type: Date,
        trim: true,  
        required: true,
        default: Date.now()
    },
    Students:[{
        studentId:{
            type: String,
        },  
        enrolledAt:{
            type: Date,
            default: Date.now()
        }
    }],
    UpdatedAt: {
        type: Date,
        trim: true,  
        required: false,
        default: Date.now()
    },
    status :{
        type: Boolean,
        default: true,
        required: true,
    },
    isPurchased :{
        type: Boolean,
        default: false,
    },
});

CourseSchema.pre('save', function(next){
    next();
});

var courses = new mongoose.model('Course',CourseSchema);

module.exports = courses;