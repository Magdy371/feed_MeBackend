import {Router} from 'express';
import {register, userLogin, verifyUser} from '../controllers/userAuthinticationController';
const router = Router();
router.post('/register', register);
router.post('/verify', verifyUser);
router.post('/login', userLogin);
export default router;