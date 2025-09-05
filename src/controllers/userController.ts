import {NextFunction, Request, Response} from 'express';
import User from '../models/User';
import asyncHandler from 'express-async-handler';
import ApiErrors from "../utils/ApiErrors";
import bcrypt from "bcrypt";
import {AuthorizationRequest} from "../middlewares/userAutherization";

const getAllUsers = asyncHandler(
    async (req:AuthorizationRequest,res:Response,next:NextFunction)=>{
        if(!req.user || req.user.role !== 'admin'){
            return next(new ApiErrors('Forbidden: Admins only',403));
        }
        const users = await User.find({isDeleted:false});
        if(users.length === 0){
            return next(new ApiErrors('No users found',404));
        }
        res.status(200).json({results: users.length, users});
    }
);

const getUser = asyncHandler(
    async (req:AuthorizationRequest, res:Response, next:NextFunction)=>{
        const {id} = req.params;
        if(req.user?.role!=='admin'&& req.user?.id.toString()!==id){
            return next(new ApiErrors('Forbidden: Access is denied',403));
        }
        const user = await User.findOne({_id:id,isDeleted:false});
        if(!user){
            return next(new ApiErrors('User not found',404));
        }

        res.status(200).json({result:user});
    }
);

const updateUser = asyncHandler(
    async(req:AuthorizationRequest, res:Response,next:NextFunction)=>{
        const {id} = req.params;
        const {name, email, age, password} = req.body;
        if(req.user?.role!=='admin'&& req.user?.id.toString()!==id){
            return next(new ApiErrors('Forbidden: Access is denied',403));
        }
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
    async(req:AuthorizationRequest, res:Response, next:NextFunction)=>{
        const {id} = req.params;
        if(!req.user || req.user.role !== 'admin'){
            return next(new ApiErrors('Forbidden: Admins only',403));
        }
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return next(new ApiErrors('user not found',404));
        }
        res.status(204).json({message: 'User deleted successfully'});
    }
);
const deactivateUser = asyncHandler(
    async(req:AuthorizationRequest, res:Response, next:NextFunction)=>{
        const {id} = req.params;
        if(req.user?.role!=='admin'&& req.user?.id.toString()!==id){
            return next(new ApiErrors('Forbidden: Access is denied',403));
        }
        // Use findByIdAndUpdate to perform a soft delete
        const user = await User.findByIdAndUpdate(id, {isDeleted: true}, {new: true});
        if(!user){
            return next(new ApiErrors('user not found',404));
        }
        res.status(204).json({message: 'User soft-deleted successfully'});
    }
);


export {getAllUsers,getUser,updateUser,deactivateUser,permenantDelete};
//68bae6a8d72ce898addf6581