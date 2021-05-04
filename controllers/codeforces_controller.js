var bodyParser = require("body-parser");
const Joi = require('joi');
const cookie = require('cookie-parser');
var urlencodedParser = bodyParser.urlencoded({extended:true});
const User = require('/Users/Kartikeya gupta/OneDrive/Desktop/codeforces_crawler/Codeforces_crawler/models/User');
const fetch = require("node-fetch");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const get_user = require("./get_user");
const { get } = require("mongoose");
module.exports = function(app){

const schema = Joi.object(
    {
        user : Joi.string().min(1).required().email(),
        pass : Joi.string().min(6).required(),
        pass1: Joi.string().min(6).required(),
    }
)

const create_Token = (user) =>{
    return jwt.sign( user.toJSON() , 'Codeforces_Crawler');
}


app.get('/register',(req,res) =>{
    // console.log(req.cookies.auth_token)
    if(get_user(req)){
        // console.log(get_user(req))
        res.redirect("/")
    }
    res.render('register.ejs')
});

app.get('/login',(req,res) =>{
    if(get_user(req)){
        res.redirect('/')
    }
    res.render('login.ejs')
});

const handleerror = (err) =>{
    console.log(err.message , err.code);
};

app.post('/register',urlencodedParser, async(req,res) =>{
    console.log(req.body);
    const validationError = schema.validate(req.body).error;
    if(validationError){
        res.render("400",{error: validationError.details[0].message});
        return;
    }
    if(req.body.pass!=req.body.pass1){
        res.render("400",{error: "Passwords must match"});
        return;        
    }
    var s = JSON.parse(JSON.stringify(req.body));
    //check if email already used
    const emailExist = await User.findOne({username:s.user});
    if(emailExist){
        res.render("400",{error: "Email is already used, use different email."});
        return;
    }
        console.log(s);
        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(s.pass,salt)

        const user = new User({
            username: s.user,
            password: hashed_password,
            confirm_password: hashed_password,
        });
    try{
        user.save();
        const token = create_Token( user)
        res.cookie("auth_token",token)
        res.status('201').render('home',{u:user});
    }
    catch(err){
        res.render('400',{error:err})
    }
})

app.post('/login',urlencodedParser, async(req,res) =>{
    var s = JSON.parse(JSON.stringify(req.body));
    const user = await User.findOne({username:s.user})
    // console.log(user)
    if(!user){
    res.send("No such Username Exists");
    return;
    }
    const valid = await bcrypt.compare(s.pass,user.password)
    if(!valid){
    res.render('400',{error: "Password is Incorrect"})
    return;
    }
    const token = create_Token(user)
    res.cookie("auth_token",token)
    res.render('home',{u:user})
    // res.redirect('/')

})

app.post('/home',urlencodedParser, async(req,res) =>{
    console.log(req.body.user)
    var url = "https://codeforces.com/api/user.info?handles="+req.body.user;
    try{
        var response = await fetch(url);
        var js = await response.json();
        if(response.status!="200"){
            res.send("No such Username Exists")
            return;
        }
        console.log(response.status);
        console.log(js.result[0].firstName);
        res.render("profile.ejs",{user:req.body.user,data:js.result[0]})
    }
    catch(err){
        res.send("Error")
    }
})
app.get('/logout',urlencodedParser,(req,res) =>{
    res.clearCookie("auth_token")
    res.redirect('/')
})

};