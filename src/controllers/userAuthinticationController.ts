import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import  User  from '../models/User';
import asynHandler from 'express-async-handler';
import ApiErrors from "../utils/ApiErrors";
import {sendVerificationEmail} from "../utils/sendEmail";
import asyncHandler from "express-async-handler";

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
const userLogin = asyncHandler(
    async (req:Request, res:Response,next:NextFunction)=>{
        const {email, password} = req.body;
        if(!email || !password){
            return next(new ApiErrors('Email and password are required',400));
        }
        const user = await User.findOne({email});
        if(!user){
            return next(new ApiErrors('Invalid email or password',401));
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return next(new ApiErrors('Invalid email or password',401));
        }
        if(!user.isVerified){
            return next(new ApiErrors('Please verify your email before logging in',403));
        }
        if(user.isDeleted){
            return next(new ApiErrors('User account is deactivated',403));
        }

        const payload = { id: user._id, role: user.role };
        const secret = process.env.JWT_SECRET as unknown as jwt.Secret;
        const expiresIn = (process.env.JWT_EXPIRES_IN as string) || '1h';
        const token = jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
        res.status(200).json({message: 'Login successful', token});
    }
);


export {register, verifyUser,userLogin}
