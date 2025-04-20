import User from "../Model/User.js";
import argon from "argon2";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import * as Constant from '../Utils/Constant/ConversionConstant.js';
import {globalResponse, generateTokenAndSetCookie} from '../Utils/GlobalMessage/GlobalMessageHandler.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (email == undefined || email == null || !email || !name || !password) {
      return globalResponse(res,Constant.INVALID_REQUEST_STATUS,Constant.INVALID_INPUT_MESSAGE,Constant.INVALID_REQUEST_TITLE);
    }

    // Finding User by Email id;
    const isEmailAlreadyPresent = await User.findOne({ email });

    if (isEmailAlreadyPresent) {
      return globalResponse(res,Constant.DUPLICATE_REQUEST_STATUS,Constant.DUPLICATE_REQUEST_MESSAGE, Constant.DUPLICATE_REQUEST_TITLE);
    }

    //hashing password
    const hashedPassword = await argon.hash(password);
    console.log(hashedPassword);
    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
    }); // When we use create means it will generate the _id and save in local not in the DB and still we can
    // Modify the data

    generateTokenAndSetCookie(res,newUser);

    const token = crypto.randomBytes(32).toString("hex");

    newUser.verificationToken = token;

    await newUser.save();

    // here JSON mean we are going to send json response
    
    return globalResponse(res,Constant.USER_CREATED_STATUS,Constant.USER_CREATED_MESSAGE,Constant.USER_CREATED_TITLE,newUser);

  } catch (error) {
    console.log(error);
    return globalResponse(res,Constant.SOMETHING_WENT_WRONG_STATUS,Constant.SOMETHING_WENT_WRONG_MESSAGE,Constant.SOMETHING_WENT_WRONG_MESSAGE);
  }
};


export const verifyUser = async (req, res) => {
  // query mean request params and req.param.token means path variable(Spring boot)/ fixed parametter
  const token = req.query.token;
  try {
    const isUserExit = await User.findOne({ verificationToken: token });
    if(isUserExit==null || isUserExit == undefined){
      res.status(404).json({
        title: "Seems URL Expired/ Invalid URL",
        message: "Please request again for verification",
      });
    }else if (isUserExit.isVerified) {
      res.status(200).json({
        title: "Already verifiyed", 
        message: "User verification successful",
      });
    }
    else if (isUserExit) {
      isUserExit.isVerified = true;
      await isUserExit.save();
      res.status(200).json({
        title: "Verification Successfully",
        message: "User verification successful",
      });
    }
  } catch (error) {
    res.status(500).json({
      title: "Something went wrong",
      message: "Please try after sometime",
    });
  }
} 

export const login = async(req,res)=>{
  const {email, password} = req.body;

  if(!email || !password){
    res.status(400).send({
      title: "Invalid Request",
      message: "Please enter the all mandtory field"
    });
  }

  const isValidUser = await User.findOne({email});

  if(isValidUser == null || isValidUser == undefined){
    res.status(404).send({
      title: "User Not found",
      message: "Unable to find the user. Please pass correct value"
    });
  }else{
    const isValidPassword = await argon.verify(isValidUser.password,password);
    console.log(isValidPassword);
    if(!isValidPassword){
      res.clearCookie('authToken');
      res.status(401).json({
        title: "Incorrect Password",
        message: "Password is not correct. please enter valid password"
      });

    }else{
      
      //generating token and setting token
      generateTokenAndSetCookie(res,isValidUser);
     
      res.status(200).json({
        title: "Valid Password",
        message: "Login Successfully"
      });
    }
  }
}

export const logout = async (req, res) =>{
  res.clearCookie("authToken");
  globalResponse(res,Constant.SUCCESS_STATUS,Constant.LOG_OUT_MESSAGE,Constant.LOG_OUT_TITLE);
}
