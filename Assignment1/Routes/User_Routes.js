const express = require('express');
const router = express.Router();
const user = require('../Model/Schema.js');


router.post('/add',async (req,res)=>{
    
    let data_user = await getdata(req);
    await savedata(data_user);
    res.send("done");
})

async function getdata(req){
    let data_user = new user({
        Username : req.body.Username,
        Password : req.body.Password
    })
    return data_user;
    }
    
    
async function savedata(data_user){
data_user.save(function (err) {
    if (err) {
        console.log("user not saved");
    } else {
        console.log("user saved");
    }
});
}

module.exports = router;

