var mongoose = require('mongoose');


const Schema = mongoose.Schema;

const VideoSchema = new Schema({
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
        type: [mongoose.Schema.Types.ObjectId],
        trim: true,  
        ref: 'Quiz'
    },
});

VideoSchema.pre('save', function(next){
    next();
});

var videos = new mongoose.model('Video',VideoSchema);

module.exports = videos;