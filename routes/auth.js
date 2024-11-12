const express=require('express');
const router=express.Router();
const  User =require('../models/User')
const bcrypt = require('bcryptjs');
const { body,validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fetchuser=require('../middle/fetchuser');



const JWT_SECTRET="THIS IS A GOOD BOY"


//create
router.post('/createuser', [
    body('username', 'Username must be more than 3 character').isLength({ min: 3 }),
    body('email', "Enter a valid Email").isEmail(),
    body('password', 'Password must have a minimum of 5 characters').isLength({ min: 5 }),
  ], async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       success=false;
      return res.status(400).json({success,  errors: errors.array() });
    }
  
    try {
  const salt=await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt);

const l= req.body.username

      const user = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: secPass
      });
      const data={
        user:{
            id:user.id
        }
      }
      const save=await user.save();
      //jwtdata is a token
     const jwtdata= jwt.sign(data,JWT_SECTRET);
     success=true;
     res.json({success,jwtdata,l});
    } catch (error) {
      success=false;
      if (error.code === 11000) {
       
        const duplicateField = Object.keys(error.keyPattern)[0];
        return res.status(400).json({success,  errors: `${duplicateField} already  exists try to login` });
      }
      console.error(error);
      success=false;
     return res.status(500).json({success, errors:"server error" });
    }
  });




  //login
  router.post('/login', [
    body('username', 'Enter a valid username').isLength({ min: 3 }),
    body('password', 'Password must have a minimum of 5 characters').isLength({ min: 5 }),
  ], async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      success=false;
      return res.status(400).json({success, errors: errors.array() });
    }
  
const{username,password}=req.body;


    try {

          const user=await User.findOne({username});
if(!user){
    return res.status(400).json({success,errors:"Please enter right username "});
}
const match=await bcrypt.compare(password,user.password);
if(!match){
    return res.status(400).json({success,errors:"Please enter right password"});  
}

const data ={
    user:{
        id:user.id
    }
}
const jwtdata= jwt.sign(data,JWT_SECTRET);
     success=true 
     res.json({success, jwtdata,username});
    }
  catch (error) {
    console.error(error);
    res.status(500).json({success,error:"server error" });
    }
  });

  







  module.exports = router;











  