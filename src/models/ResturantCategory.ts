import {Schema, model} from "mongoose";
import {IRestaurant} from "../interfaces/IRestaurant";

const resturantSchema = new Schema<IRestaurant>({
    name: {type: String, required: true, unique: true},
    city: {type: String, required: true},
    address: {type: String, required: false},
    category: {type: Schema.Types.ObjectId, ref: 'FoodCategory', required: true}, // Reference to FoodCategory
    }, {
    timestamps: true,
});
const Resturant = model<IRestaurant>('Restaurant',resturantSchema);
export default Resturant