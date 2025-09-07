import ApiErrors from '../utils/ApiErrors';
import {AuthorizationRequest} from "../middlewares/userAutherization";
import { Request, Response, NextFunction } from 'express';
import FoodCategory from '../models/FoodCategory';
import asyncHandler from 'express-async-handler';

const createFoodCategory = asyncHandler(
    async (req:AuthorizationRequest, res:Response, next:NextFunction) => {
        if(req.user?.role !== 'admin'){
            return next(new ApiErrors('Forbidden: Admins only',403));
        }
        const {name, description} = req.body;
        const existingCategory = await FoodCategory.findOne({name});
        if(existingCategory){
            return next(new ApiErrors('Food category already exists',400));
        }
        const foodCategory = await FoodCategory.create({name, description});
        res.status(201).json({message: 'Food category created successfully', foodCategory});
    }
);
const categoryList = asyncHandler(
    async (req:Request, res:Response, next:NextFunction) => {
        const categories = await FoodCategory.find();
        if(categories.length === 0){
            return next(new ApiErrors('No food categories found',404));
        }
        res.status(200).json({results: categories.length, categories});
    }
);

const getFoodCategory = asyncHandler(
    async (req:Request, res:Response, next:NextFunction) => {
        const {id} = req.params;
        const category = await FoodCategory.findById(id);
        if(!category){
            return next(new ApiErrors('Food category not found',404));
        }
        res.status(200).json({category});
    }
);

const updateFoodCategory = asyncHandler(
    async (req:AuthorizationRequest, res:Response, next:NextFunction) => {
        const {id} = req.params;
        const {name, description} = req.body;
        if(req.user?.role !== 'admin'){
            return next(new ApiErrors('Forbidden: Admins only',403));
        }
        const category = await FoodCategory.findById(id);
        if(!category){
            return next(new ApiErrors('Food category not found',404));
        }
        category.name = name || category.name;
        category.description = description || category.description;
        await category.save();
        res.status(200).json({message: 'Food category updated successfully', category});
    }
);

const deleteFoodCategory = asyncHandler(
    async (req:AuthorizationRequest, res:Response, next:NextFunction) => {
        const {id} = req.params;
        if(req.user?.role !== 'admin'){
            return next(new ApiErrors('Forbidden: Admins only',403));
        }
        const category = await FoodCategory.findByIdAndDelete(id);
        if(!category){
            return next(new ApiErrors('Food category not found',404));
        }
        res.status(200).json({message: 'Food category deleted successfully'});
    }
);
export {createFoodCategory, categoryList, getFoodCategory, updateFoodCategory, deleteFoodCategory};