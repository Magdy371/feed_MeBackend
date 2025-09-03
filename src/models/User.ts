import {Schema, model} from 'mongoose';
import {IUser} from '../interfaces/IUser';

const userSchema = new Schema<IUser>({
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, unique: true,match:[/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Only Gmail addresses allowed"]},
    password: {type: String, required: true},
    age: {type: Number, required: false,min:0},
    isVerified: {type: Boolean, default: false}
}, {
    timestamps: true
});
const User = model<IUser>('User', userSchema);
export default User;