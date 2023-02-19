var mongoose = require('mongoose');


const Schema = mongoose.Schema;

const MaterialSchema = new Schema({
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
    URL: {
        type: String,
        trim: true,  
        required: true
    },
    CreatedAt: {
        type: Date,
        trim: true,  
        required: true
    }

});

MaterialSchema.pre('save', function(next){
    next();
});

var materials = new mongoose.model('Material',MaterialSchema);

module.exports = materials;