var mongoose = require('mongoose');


const Schema = mongoose.Schema;

const MaterialSchema = new Schema({
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

MaterialSchema.pre('save', function(next){
    next();
});

var materials = new mongoose.model('Material',MaterialSchema);

module.exports = materials;