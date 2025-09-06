import ApiErrors from "../utils/ApiErrors";
import { AuthorizationRequest } from "../middlewares/userAutherization";
import { Request, Response, NextFunction } from "express";
import Restaurant from "../models/ResturantCategory"; // corrected spelling
import FoodCategory from "../models/FoodCategory";
import asyncHandler from "express-async-handler";

const createRestaurant = asyncHandler(
    async (req: AuthorizationRequest, res: Response, next: NextFunction) => {
        if (req.user?.role !== "admin") {
            return next(new ApiErrors("Forbidden: Admins only", 403));
        }
        const { name, city, address, category } = req.body;
        if (!name || !city || !category) {
            return next(new ApiErrors("Name, city, and category are required", 400));
        }

        const existingCategory = await FoodCategory.findById(category);
        if (!existingCategory) {
            return next(new ApiErrors("Invalid category ID", 400));
        }

        // prevent duplicates in the same city
        const existingRestaurant = await Restaurant.findOne({ name, city });
        if (existingRestaurant) {
            return next(new ApiErrors("Conflict: A restaurant with this name already exists in this city", 409));
        }

        const newRestaurant = new Restaurant({name, city, address, category,});
        await newRestaurant.save();

        res.status(201).json({success: true, message: "Restaurant created successfully", data: newRestaurant,});
    }
);

const getRestaurants = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const resturamt = await Restaurant.find().populate("category", "name");
        res.status(200).json({success: true, message: "Restaurants fetched successfully", data: resturamt,});
    }
);

const getRestaurant = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { city, category } = req.query;
        const filter: any = {};
        if (city) filter.city = city;
        if (category) {
            const categoryDoc = await FoodCategory.findOne({$or: [{ _id: category }, { name: category }],});
            if (categoryDoc) {
                filter.category = categoryDoc._id;
            } else {
                return next(new ApiErrors("Category not found", 404));
            }
        }
        const restaurants = await Restaurant.find(filter).populate(
            "category",
            "name");

        res.status(200).json({success: true, message: "Restaurants fetched successfully", data: restaurants,});
    }
);

const deleteRestaurant = asyncHandler(
    async (req: AuthorizationRequest, res: Response, next: NextFunction) => {
        if (req.user?.role !== "admin") {
            return next(new ApiErrors("Forbidden: Admins only", 403));
        }

        const { id } = req.params;
        const restaurant = await Restaurant.findByIdAndDelete(id);

        if (!restaurant) {
            return next(new ApiErrors("Restaurant not found", 404));
        }

        res.status(200).json({success: true, message: "Restaurant deleted successfully"});
    }
);

export { createRestaurant, getRestaurant, getRestaurants, deleteRestaurant };
