var mongoose = require('mongoose');


const Schema = mongoose.Schema;

const VideoSchema = new Schema({
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
    QuizID: {
        type: String,
        trim: true,  
        required: true
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
    
});

VideoSchema.pre('save', function(next){
    next();
});

var videos = new mongoose.model('Video',VideoSchema);

module.exports = videos;