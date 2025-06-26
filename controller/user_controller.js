import { validationResult } from "express-validator";
import { User } from "../model/user_model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { request, response } from "express";
dotenv.config();
 

export const signup = async(request,response,next)=>{
try {
    const errorvalidate = validationResult(request);
    if(!errorvalidate.isEmpty())
        return response.status(401).json({message:"Bad request",err:errorvalidate.array()[0].msg})

    let{name,email,password,contact} = request.body;
    let checkEmail = await User.findOne({email});
    if(checkEmail)
        return response.status(201).json({message:"Email Already Exists!"});
    let salt = bcrypt.genSaltSync(12);
    // console.log("Old Password = ",password);
    

    password =  bcrypt.hashSync(password,salt);
    // console.log("New Password = ",password);
//userdatatoken(name,email,password,contact);

    let a = await sendEmail(email,name,userdatatoken(name,email,password,contact));
    return response.status(201).json({message:"We Send Email Verification Link on your mail..."});



     
    
    // let user = await  User.create({name,email,password,contact});
    // if(user!=null){
    //     return response.status(201).json({message:"Sign Up Successfully"});
    // }return response.status(201).json({message:"Account not Create"});

} catch (error) {
    console.log(error);    
    return response.status(500).json({message:"Internal Server Error"});
}
};

export const login = async(request,response,next)=>{
    try {
        const errorvalidate = validationResult(request);
        if(!errorvalidate.isEmpty())
            return response.status(401).json({message:errorvalidate.array()[0].msg})
        let{email,password} = request.body;

        let userdata = await User.findOne({email:email});
        console.log(userdata);
        
        if(userdata==null){
            return response.status(404).json({message:"Email is Incorrect"});
        }

       let  isMatch = bcrypt.compareSync(password,userdata.password);
        if(isMatch==true){
            console.log("_id = ",userdata._id);
            console.log("_id = ",userdata.email);
            
            response.cookie("token",generateToken(userdata._id,userdata.email))
            return response.status(201).json({message:"Login Successfully...",user:userdata});

        }
            return response.status(404).json({message:"Password is Incorrect"});

          

    } catch (error) {
        console.log(error);        
        return response.status(500).json({message:"Internal Server"});
    }
};

export const logout = async(request,response,next)=>{
    try {
        response.clearCookie("token");
        return response.status(200).json({message:"Logout Successfully..."});

    } catch (error) {
        console.log(error);
        return response.status(500).json({message:"Internal Server Error"});
        
    }
};


// -------------------- Token , Email, Verified ----------------------


function generateToken(userid,useremail){
    let payload = {userid,useremail};
    const token = jwt.sign(payload,process.env.SECRET_KEY);
    return token;
};

export const verified1 =async (request,response,next)=>{

    try {
        let{token} = request.body;
        console.log("Token Verifeid = ",token);
        
        let ver = jwt.verify(token,"amitsir");
        let{name,email,password,contact} = ver;
        // console.log(name," : ",email," : ",password," : ",contact);
        
        if(email){
            //  request.isVerfied1 = true;
             let user = await  User.create({name,email,password,contact,isVerified:true});
            // console.log("User = ",user);
            
            if(user!=null)
                return response.status(201).json({message:"Account Created"});
             
            return response.status(201).json({message:"Account Not Created"})
        }
        
        
    } catch (error) {
        console.log(error);
             return response.status(500).json({error: "Internal Server Error"});

        
    }
}

let sendEmail = (email,name,token)=>{
     return new Promise((resolve,reject)=>{
let transporter = nodemailer.createTransport({
    
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

let mailOptions = {
  from: process.env.EMAIL,
  to: email,
  subject: 'Account Verification',
  html: `<div style = "border:2px solid silver;border-radius:10px;padding:20px;">
  <p style="color: #333;text-align: center;font-family: 'Segoe UI', sans-serif ;margin-bottom: 20px;">Dear <span style="font-family: 'Helvetica Neue', Arial, sans-serif;font-weight: 700;color:purple;font-size:20px"> ${name}</span> <br>Thank you for registration. <br> To verify account please click on below button</p>
         <form method="post" action="http://localhost:3000/user/verification">
         <input type="hidden" name="token"value="${token}">
<br><br>
         <button style="
  padding: 12px 24px;
  background-color: #007bff;
  text-align: center;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: background-color 0.3s ease;
">Verification</button>
         </form></div>`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
    reject(error)
  } else {
    console.log('Email sent: ' + info.response);
    resolve(true);
  }
})})};


function userdatatoken(name,email,password,contact) {
    let payload = {name,email,password,contact};
    let token = jwt.sign(payload,"amitsir");
    return token;
}

