import  Express  from "express";
import { User } from "../models/User.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const router = Express.Router();

const SECRET=process.env.JWT_SECRET;
//Creating a user
router.post("/createuser",
[
  //Validating the responses from user
  body('email',"Invalid Credentials").isEmail(),
  body('password',"Invalid Credentials").isLength({min:8}),
  body('name',"Invalid Credentials").isLength({min:4}),
],
 async(req,res)=>{
 
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).send({ errors: result.array() });
  }
 
   const {email,location,name,password}=req.body;
   try{
      // Checking if a user with email already exists or not 
      let user=await  User.findOne({'email':email}).exec();
      if(user){
        return res.status(400).json({
            message:"Your email are already exists"
        })
      }
      let salt =await bcrypt.genSaltSync(10);
      let securedPassword =await bcrypt.hashSync(password, salt);
      //If User does not exist,create in DataBase
      user=await User.create({
          name:name,
          location:location,
          password:securedPassword,
          email:email
      });
      const data={
        user:{
          id:user.id
        }
      }
      const authid=jwt.sign(data,SECRET)
      res.json({
        success:true,
        authid
      });
   }
   catch(error){
    res.json({
        success:true,
        message:error
    });      
   }
}); 


//Login user

router.post("/loginuser",
[
  //Validating the responses from user
  body('email',"Invalid Credentials").isEmail(),
  body('password',"Invalid Credentials").isLength({min:8}),
]
,async(req,res)=>{

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).send({ 
      success:false
     });
  }
   const {email,password}=req.body;
   try{
      // Checking if a user with email already exists or not 
      let user=await  User.findOne({'email':email}).exec();
      if(user){
          let ismatched=bcrypt.compareSync(password,user.password)
          if(!ismatched){
            return res.status(400).json({
              success:false,
              message:"Please Enter valid credentials"
            });
          }
      }
      const data={
        user:{
          id:user.id
        }
      }
      const authid=jwt.sign(data,SECRET);
      res.json({
        success:true,
        authid
      });
    }
   catch(error){
    res.status(404).json({
        success:false,
        message:error
    });      
   }
}); 

export default router;