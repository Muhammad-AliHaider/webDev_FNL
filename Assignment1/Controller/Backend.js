const mongoose = require('mongoose');
const express = require('express');
const User_Routes = require('../Routes/User_Routes');
const bodyparser = require('body-parser');
const app = express();


const url = "mongodb+srv://webDev:12ali12@clusterwebdev.iyxo2oe.mongodb.net/?retryWrites=true&w=majority";

const connectionParams={
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true 
}
connectDB();


app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

app.use('/user',User_Routes)

// app.get('/user',(req,res)=>{
//     res.send('hello');
// })
app.listen(3000);



mongoose.set('strictQuery', false);


function connectDB(){
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to the database');
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    })

  }