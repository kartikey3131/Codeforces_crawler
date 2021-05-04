const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username:{
        type: String,
        required: [true, "Please Enter valid Username"],
        // validate:[isemail,"Please Enter valid email id"] 
    },
    password :{
        type: String,
        required:[true,"Please enter password"],
    },
    confirm_password :{
        type: String,
        required : [true,"Please confirm your password"],
    }

},{timestamps:true});

const User = mongoose.model('User',UserSchema);
module.exports = User;