var mongoose = require('mongoose');


const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    ID: {
        type: String,
        trim: true,  
        required: true  
    },
    CourseEnrolled: {
        type: [{
            id:{
                type:String,
                required: true
            },
            progress:{
                type:[{
                    quiz:{
                        type: String,
                    },
                    name:{
                        type: String,
                    },
                    score:{
                        type: Number,
                    }
                }],
                default:[]
            },
            name:{
                type:String,
                required: true
            },
        }],
        trim: true,
        required:true,
        default:[]  
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

StudentSchema.pre('save', function(next){
    next();
});

var students = new mongoose.model('Student',StudentSchema);

module.exports = students;