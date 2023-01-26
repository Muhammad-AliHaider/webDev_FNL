const mongoose = require('mongoose');
const express = require('express');
const app = express();
const user = require('..\\Controller\\Schema.js');


app.set('view engine','ejs');

app.get('/',(req,res)=>{
    connectDB();
    let data_user = getdata();
    savedata(data_user);
    connectionclose();
})

app.listen(3000);

const url = "mongodb+srv://webDev:12ali12@clusterwebdev.iyxo2oe.mongodb.net/?retryWrites=true&w=majority";

const connectionParams={
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true 
}
// console.log("123213123");

async function connectDB(){
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to the database');
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. n${err}`);
    })

  }



async function connectionclose(){
mongoose.connection.close();
}

async function getdata(){
  let data_user = new user({
      Username : 'ali',
      Password : '12ali'
  })
  return data_user;
  }
  
  
  async function savedata(data_user){
  data_user.save(function (err) {
    if (err) {
        console.log("nahi huha bhai");
    } else {
        console.log("hugaya bhai");
    }
  });
  }
// const c = user.find({},function(err,docs){

//     exports.array = docs
// })

