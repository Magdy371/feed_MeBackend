import {model, Types} from "mongoose";

export interface IRestaurant {
    name: string;
    city: string;
    address?: string;
    category: Types.ObjectId; // Reference to FoodCategory
}
