const express = require('express')
const logger = require('morgan');
const users = require('./routes/User');
const bodyParser = require('body-parser')
const app = express();
const dbConfig = require('./config/database.config');
const mongoose = require('mongoose');
const cookieparser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

app.get('/', function(req, res){
    res.render('form');
});
app.use(upload.array()); 
app.use(express.static('public'));

app.use(cookieparser());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())
app.use('/user',users)
app.use(function(req, res, next) {
    let err = new Error('Not Found');
       err.status = 404;
       next(err);
});
app.use(function(err, req, res, next) {
    console.log(err);
    
    if(err.status === 404)
      res.status(404).json({message: "Not found"});
    else 
       res.status(500).json({message: "Something looks wrong :( !!!"});
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






