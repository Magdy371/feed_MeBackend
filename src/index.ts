import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db';
import userAuthinticationRoute from './routes/userAuthinticationRoute';
import userRoutes from "./routes/userRoutes";
import foodCategoryRoute from "./routes/foodCategoryRoute";
import resturantRoute from "./routes/resturantRoute";
import {Response, Request, NextFunction} from "express";
import express from 'express';
import ApiErrors from './utils/ApiErrors';
import authMiddleware from './middlewares/userAutherization'
import globalErroHandler from './middlewares/globalErrorHandling';

const PORT = process.env.PORT || 8000;
const server = express();

server.use(express.json());
server.use('/api/v1/auth', userAuthinticationRoute);
server.use('/api/v1/users',authMiddleware ,userRoutes);
server.use('/api/v1/foodCategory', foodCategoryRoute);
server.use('/api/v1/resturants', resturantRoute);

// Handle undefined routes
server.use((req:Request, res:Response, next:NextFunction) => {
    next(new ApiErrors(`Cannot go to this route ${req.originalUrl}`, 404));
});


// Global error handler middleware
server.use(globalErroHandler);

connectDB()
    .then(() => {
        console.log('Database connected successfully');
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });
