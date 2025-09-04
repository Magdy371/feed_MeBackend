import {Router} from 'express';
import {getAllUsers, updateUser, getUser, permenantDelete, deactivateUser} from "../controllers/userController";

const router = Router();

router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).put(updateUser).delete(deactivateUser);
router.route('/deletePermenant/:id').delete(permenantDelete);
export default router;