import {Document} from 'mongoose';
export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    age?: number;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}