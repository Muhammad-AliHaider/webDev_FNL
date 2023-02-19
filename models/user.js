var mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const saltRounds = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    UserName: {
        type: String,
        trim: true,  
        required: true  
    },
    Password: {
        type: String,
        trim: true,  
        required: true
    },
    Name: {
        type: String,
        trim: true,  
        required: true
    },
    Age: {
        type: Number,
        trim: true,  
        required: true
    },
    Gender: {
        type: String,
        trim: true,  
        required: false
    },
    Email: {
        type: String,
        trim: true,  
        required: true
    },
    Notification: {
        type: [String],
        trim: true,  
        required: false
    },
    ProfilePic: {
        type: String,
        trim: true,  
        required: false
    },
    BIO: {
        type: String,
        trim: true,  
        required: false
    },
    CreditCard: {
        type: Number,
        trim: true,  
        required: true
    },
    CreatedAt: {
        type: Date,
        trim: true,  
        required: true
    },
    Role: {
        type: Number,
        trim: true,  
        required: true
    },
    
});

UserSchema.pre('save', function(next){
    const hash = bcrypt.hashSync(this.Password, saltRounds);
    this.Password=hash;
    next();
});

var users = new mongoose.model('User',UserSchema);

module.exports = users;