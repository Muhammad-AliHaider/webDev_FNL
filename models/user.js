var mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    UserName: {
        type: String,
        trim: true,
        unique: true,  
        required: true  
    },
    Password: {
        type: String,
        trim: true,  
        required: true,
        minlength: 8
    },  
    isVerified: {
        type: Boolean,
        default: false
    },
    Name: {
        type: String,
        trim: true,  
        required: true
    },
    Age: {
        type: String,
        trim: true,  
        required: true
    },
    Gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        trim: true,  
        required: false
    },
    Email: {
        type: String,
        trim: true,  
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    },
    Notification: {
        type: [{
            message: {
              type: String,
              required: true
            },
            timestamp: {
              type: Date,
              required: true
            }
          }],
          default: []
    },
    ProfilePic: {
        type: String,
        trim: true,  
        required: false,
        match: /^(http|https):\/\/[^]+$/
    },
    BIO: {
        type: String,
        trim: true,  
        required: false
    },
    CreditCard: {
        cardNumber:{
            type: String,
            required: false,
            default: " "
        },
        expirationDate:{
            type: String,
            required: false,
            //match:/^(0[1-9]|1[0-2])\/[0-9]{2}$/,
            default: " "
        },
        securityCode:{
            type:String,
            required:false,
            //match:/^[0-9]{3,4}$/,
            default: " "
        },
        cardholderName:{
            type:String,
            required:false,
            //match:/^[0-9]{3,4}$/,
            default: " "
        }
    },
    CreatedAt: {
        type: Date,
        trim: true,  
        required: true
    },
    Role: {
        type: String,
        enum:[1,2,3],
        trim: true,  
        required: true
    },
    status :{
        type: Boolean,
        default: true,
        required: true,
    }
    
});

UserSchema.pre('save', function(next){
    const hash = bcrypt.hashSync(this.Password, saltRounds);
    this.Password=hash;
    next();
});
var users = new mongoose.model('User',UserSchema);

module.exports = users;