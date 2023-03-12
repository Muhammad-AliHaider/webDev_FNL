var mongoose = require('mongoose');


const Schema = mongoose.Schema;

const CourseSchema = new Schema({
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
        required: true
    },
});

CourseSchema.pre('save', function(next){
    next();
});

var courses = new mongoose.model('Course',CourseSchema);

module.exports = courses;