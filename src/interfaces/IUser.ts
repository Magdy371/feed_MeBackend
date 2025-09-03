import {Document} from 'mongoose';
type userRole = 'user' | 'admin';
export interface IUser extends Document{
    name: string;
    email: string;
    password: string;
    age?: number;
    isVerified: boolean;
    role: userRole;
    createdAt: Date;
    updatedAt: Date;
    verificationCode?: number;
}