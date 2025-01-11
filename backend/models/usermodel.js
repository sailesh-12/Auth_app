const mongoose = require("mongoose");

const userSchema=new mongoose.Schema({
	name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    lastLogin:{type:Date},
	isVerified:{type:Boolean},
	resetPasswordToken:{type:String},
	resetPasswordExpires:{type:Date},
	verificationToken:{type:String},
	verificationExpires:{type:Date},
    isAdmin:{type:Boolean,default:false}

},{timestamps:true});

const userModel=mongoose.model("user",userSchema);
module.exports=userModel