const express = require("express");
const mongoose = require ("mongoose")
const Users = require("../Controllers/user")
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomstring = require('randomstring');
const PASSWORD=process.env.PASSWORD 

//initalize the router
const router=express.Router();

// Register page

router.post('/signup' , async (req, res) => {
    const {name, email, password } = req.body;
    
    try {
      // Check if a user with the same email already exists
      const existingUser = await Users.findOne({ email });
      
      if (existingUser) {
        return res.status(409).json({ error: 'Email already in use' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new Users({
        name:name,
        email: email,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      return res.status(500).json({ error: 'User registration failed' });
    }

  })
// getting all user data
router.get("/all",async(req,res)=>{
  try{
    const usersdata=await Users.find({});
    if(usersdata.length<=0){
      res.status(400).json({data:"User Not Found"})
      return
    }
     res.status(200).json({data:usersdata})
  }catch (error) {
    console.log(error)
    res.send(500).json({data:"Internal Server Error"})
 }
})
// existing user login
router.post("/login",async(req,res)=>{
    try {
        //is user available
        const user=await Users.findOne({email:req.body.email});
        if(!user){
            res.status(404).json({data:"Invaild Email"})
        }
        //is password is valid
        const validPassword=await bcrypt.compare(
            req.body.password,
            user.password
        )//compare my hashed and password in req.body
        if(!validPassword){
            return res.status(400).json({data:{message:"Invalid Password",result:validPassword,statusCode:400}})
        }
        
        res.status(200).json({data:{message:"Sucessfully Logged In",result:validPassword,statusCode:200}})
    } catch (error) {
        console.log(error)
        res.send(500).json({data:"Internal Server Error"})
     
    }
})


//Implement the forgot password route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    const Users = mongoose.model('Users');
    const user = await Users.findOne({ email });
  
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    function generateRandomString(length) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charLength = characters.length;
      let randomString = '';
  
      for (let i=0; i< length; i++){
        const randomIndex = Math.floor(Math.random() * charLength);
        randomString += characters.charAt(randomIndex);
      }
      return randomString;
     
    }
   const token=generateRandomString(20);
  
const randomStrings = token;
user.restToken = randomStrings;
await user.save();
// console.log(user.email);
  // Send the reset password link to the user's email
  const resetLink = `https://resetpasswordflowmb.netlify.app/ChangePassword/${randomStrings}`; 

  // Define the sendResetEmail function
const sendResetEmail = (email, resetLink) => {
  
  const transporter = nodemailer.createTransport({
    host:process.env.HOST,
    service:process.env.SERVICE,
    port:Number(process.env.EMAIL_PORT),
    secure:Boolean(process.env.SECURE),
    
    auth: {
      user: process.env.USER,
      pass: PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: 'Password Reset Link',
    html: ` <h1>Hello,</h1>
                <p>Please click the following link to reset your password:</p>
                <h3><a href="${resetLink}">Reset Password</a></h3>
                <p>If you did not request a password reset, please ignore this email.</p>
          
            <h4>Thank You</h4>
            <h4>Reset Password Flow</h4>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      // Handle the error, maybe return an error response to the client
    } else {
      console.log('Email sent:', info.response);
      // Handle the success, maybe return a success response to the client
    }
  });
};
sendResetEmail(email, resetLink, randomStrings);
  res.json({ message: 'Reset password link sent to your email.' });

})
  
// Reset Password Route
router.post('/reset-password/:randomString', async (req, res) => {
    const { randomString } = req.params;
    // console.log(randomString);
    const { newPassword } = req.body;
  
    try {
      const user = await Users.findOne({restToken:randomString });
    //   console.log(user);
      if (!user) {
        return res.status(404).json({ error: 'Invalid random string' });
      }
  
      // Update user's password
      const saltRounds=10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedPassword;
      user.randomString = null; // Clear the random string
      await user.save();
      
  
      return res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Error resetting password:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  module.exports = router;