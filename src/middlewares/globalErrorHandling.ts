import {Request, Response,NextFunction} from "express";
import ApiErrors from '../utils/ApiErrors';

const globalErroHandler = (err:ApiErrors, req:Request, res:Response,next:NextFunction) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';

    res.status(statusCode).json({
        status,
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });

};
export default globalErroHandler;