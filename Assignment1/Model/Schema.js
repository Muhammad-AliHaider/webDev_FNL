const mongoose = require('mongoose');

const user = mongoose.Schema({
    Username :{
        type : String,
        required : true
    },
    Password :{
        type : String,
        required : true
    }
});

module.exports = mongoose.model('user',user);