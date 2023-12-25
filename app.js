const express= require('express');
const bodyparser=require('body-parser');
const ejs = require('ejs');
const app=express();
app.set("view engine","ejs");
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

// encryption

const encrypt=require('mongoose-encryption');
const key ="thisismykey";

// mongoose 

const mongoose = require('mongoose');
main().then(()=>{
    console.log("connected with databse")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/secret-keeper');
}
const details= new mongoose.Schema({
    email:String,
    password:String
});
details.plugin(encrypt,{secret:key,encryptedFields:["password"]})
const user_details = mongoose.model("user_details",details);


//code
app.get('/',(req,res)=>{
    res.render("home");
})
app.get('/register',(req,res)=>{
    res.render("register");
})
app.post('/register',(req,res)=>{
    const element = new user_details ({
        email:req.body.email,
        password:req.body.password
     });
	element.save().then((res)=>{console.log(res)
    }).catch((err)=>{ console.log(err)})
    .then(()=>{
        res.redirect("secrets")}
    )
})
app.get('/login',(req,res)=>{
    res.render("login");
})
app.post('/login', async (req, res) => {
    try {
        const entered_email = req.body.email;
        const user_password = req.body.password;
        const foundUser = await user_details.findOne({ email: entered_email });
        console.log(foundUser)
        if (foundUser && foundUser.password === user_password) {
            res.redirect("secrets/"+entered_email)
        } else {
            res.redirect('failed')
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/secrets/:enteredmail',(req,res)=>{
    res.render("secrets");
})
app.get('/failed',(req,res)=>{
    res.render("failed");
})


app.listen('8000',()=>{
    console.log("serevr is started");
})