import {Schema, model} from "mongoose";
import {IFoodCategory} from "../interfaces/IFoodCategory";

const foodCategorySchema = new Schema<IFoodCategory>({
    name: {type: String, required: true, unique: true},
    description: {type: String, required: false},
}, {
    timestamps: true,
});

const FoodCategory = model<IFoodCategory>('FoodCategory', foodCategorySchema);

export default FoodCategory;