const express = require('express');
const app = express();
const cookie = require('cookie-parser');
app.set('view engine', 'ejs')
app.use(express.static('./assets'));
app.use(express.urlencoded({extended: true}));
app.use(cookie())
const mongoose = require('mongoose');
const dbURI = "mongodb+srv://kkg:test1234@cluster0.exr2x.mongodb.net/Todo?retryWrites=true&w=majority";
mongoose.connect(dbURI,{useNewUrlParser:true , useUnifiedTopology: true})
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));

app.set('view engine', 'ejs')
app.use(express.static('./assets'));
app.use(express.urlencoded({extended: true}));
const User = require('./models/User')
const port =5000
app.listen(port,() =>{
    console.log('Listening to port 5000');
})
const controller = require('./controllers/codeforces_controller');
const get_user = require('./controllers/get_user');
controller(app);
app.get('/', (req,res) =>{
    res.render('home',{u:get_user(req)});
});

// app.use((req,res) =>{
//     res.send(req.body)
// })