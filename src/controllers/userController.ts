import {NextFunction, Request, Response} from 'express';
import User from '../models/User';
import asyncHandler from 'express-async-handler';
import ApiErrors from "../utils/ApiErrors";
import bcrypt from "bcrypt";

const getAllUsers = asyncHandler(
    async (req:Request,res:Response,next:NextFunction)=>{
        const users = await User.find({isDeleted:false});
        if(users.length === 0){
            return next(new ApiErrors('No users found',404));
        }
        res.status(200).json({results: users.length, users});
    }
);

const getUser = asyncHandler(
    async (req:Request, res:Response, next:NextFunction)=>{
        const {id} = req.params;
        const user = await User.findOne({_id:id,isDeleted:false});
        if(!user){
            return next(new ApiErrors('User not found',404));
        }
        res.status(200).json({result:user});
    }
);

const updateUser = asyncHandler(
    async(req:Request, res:Response,next:NextFunction)=>{
        const {id} = req.params;
        const {name, email, age, password} = req.body;
        let user = await await User.findOne({_id:id,isDeleted:false});
        if(!user){
            return next(new ApiErrors('User not found',404));
        }
        if(password){
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.age = age || user.age;
        await user.save();
        res.status(200).json({message: 'User updated successfully', user});
    }
);

const permenantDelete = asyncHandler(
    async(req:Request, res:Response, next:NextFunction)=>{
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return next(new ApiErrors('user not found',404));
        }
        res.status(204).json({message: 'User deleted successfully'});
    }
);
const deactivateUser = asyncHandler(
    async(req:Request, res:Response, next:NextFunction)=>{
        const {id} = req.params;
        // Use findByIdAndUpdate to perform a soft delete
        const user = await User.findByIdAndUpdate(id, {isDeleted: true}, {new: true});
        if(!user){
            return next(new ApiErrors('user not found',404));
        }
        res.status(204).json({message: 'User soft-deleted successfully'});
    }
);


export {getAllUsers,getUser,updateUser,deactivateUser,permenantDelete};