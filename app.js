const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const Auth = require('./routes/Auth');
const Admin = require('./routes/Admin');
const Student = require('./routes/Student');
const Teacher = require('./routes/Teacher');
const bodyParser = require('body-parser')
const app = express();
const dbConfig = require('./config/database.config');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
app.use(express.static('public'));
app.use(cors());

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())
app.use('/admin',Admin)
app.use('/student',Student)
app.use('/auth',Auth)
app.use('/teacher',Teacher)
app.use(function(req, res, next) {
    let err = new Error('Not Found');
       err.status = 404;
       next(err);
});

app.use(function(err, req, res, next) {
    // console.log(err);
    
    if(err.status === 404)
      res.status(404).json({message: "Not found"});
});


mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url,{
    useNewUrlParser: true
}).then(() =>{
    console.log("Database Connected Succesfully");
}).catch(err =>{
    console.log('Could not connect to the database',err);
    process.exit();
})


app.get('/',(req, res) => {
    res.json({"message": "FNL WORKING"});
})
app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});


app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})






