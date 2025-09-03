import {Router} from 'express';
import {register, verifyUser} from '../controllers/userAuthinticationController';
const router = Router();
router.post('/register', register);
router.post('/verify', verifyUser);
export default router;