import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import  User  from '../models/User';
import asynHandler from 'express-async-handler';
import ApiErrors from "../utils/ApiErrors";
import {sendVerificationEmail} from "../utils/sendEmail";

const generateVerificationCode = ()=>Math.floor(100000 + Math.random() * 900000);
const register = asynHandler(
    async(req:Request, res:Response, next:NextFunction)=>{
        const {name,email,password,age,role} = req.body;
        if(!name || !email || !password){
            return next(new ApiErrors("Name, email and password are required", 400));
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return next(new ApiErrors('Conflict:Email is already in use',409));
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationCode = generateVerificationCode();
        const user = await User.create({role,name, email, password: hashedPassword, age,verificationCode});
        await sendVerificationEmail(email, verificationCode);
        res.status(201).json({message: 'User registered successfully',
        user:{
            id: user._id,
            name: user.name,
            email: user.email,
            age: user.age,
            role: user.role,
            verificationCode: user.verificationCode,
            isVerified: user.isVerified
        }});
    }
);

//verify user
const verifyUser = asynHandler(
    async(req:Request, res:Response, next:NextFunction)=>{
        const{email,code} = req.body;
        const user = await User.findOne({email});
        console.log("Stored code:", user?.verificationCode);
        console.log("Received code:", code, "as type", typeof code);
        if(!user) {
            return next(new ApiErrors('User not found', 404));
        }
        if(user.verificationCode !== Number(code)){
            return next(new ApiErrors('Invalid verification code',400));
        }
        user.isVerified = true;
        user.verificationCode = undefined;
        await user.save();
        res.status(200).json({message: 'User verified successfully',isVerified: user.isVerified});
    }
);
export {register, verifyUser}
