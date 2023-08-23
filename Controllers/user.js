const mongoose = require('mongoose');

 const userSchema=new mongoose.Schema({
    name:{
    type:String,
    required:true,
    },
    email:
    {type : String,
        required:true,
        unique:true,
        trim:true,
        lowercase: true ,
 },
  password:
  {
    type:String,
    required:true,
  },
  restToken:{
  type:String,
  default:null,
  },
  resetPasswordToken:String,
  resetPasswordExpires:Date,
});

const Users=mongoose.model("Users",userSchema);

module.exports=Users;