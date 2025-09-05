import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ApiError from '../utils/ApiErrors';

export interface AuthorizationRequest extends Request {
    user?: {
        id: string;
        role: 'user' | 'admin';
    };
}

const authMiddleware = (req: AuthorizationRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ApiError('Unauthorized: No token provided', 401));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if (!decoded.id || !decoded.role) {
            return next(new ApiError('Unauthorized: Token missing required fields', 401));
        }

        req.user = {
            id: decoded.id as string,
            role: decoded.role as 'user' | 'admin',
        };

        next();
    } catch (err) {
        return next(new ApiError('Unauthorized: Invalid token', 401));
    }
};

export default authMiddleware;