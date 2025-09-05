import { Response, NextFunction } from 'express';
import ApiError from '../utils/ApiErrors';
import { AuthorizationRequest } from '../middlewares/userAutherization'; // adjust path if needed

const isAdmin = (req: AuthorizationRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== 'admin') {
        return next(new ApiError('Forbidden: Admins only', 403));
    }
    next();
};

export default isAdmin;