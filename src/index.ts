import dotenv from 'dotenv';
dotenv.config();
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('PORT:', process.env.PORT);
import express from 'express';
import connectDB from "./config/db";


const PORT = process.env.PORT || 8000;
const server = express();

connectDB().then(()=>{
    console.log('server started successfully');
    server.listen(PORT,()=>{
        console.log(`the port is applied`)
    })
}).catch((error)=>{
    console.error(`error : ${error as Error}`);
});

