import {createFoodCategory,
    categoryList,
    getFoodCategory,
    updateFoodCategory,
    deleteFoodCategory
} from '../controllers/foodCategoryController';

import {Router} from "express";

const router = Router();

router.post('/', createFoodCategory);
router.get('/', categoryList);
router.get('/:id', getFoodCategory);
router.put('/:id', updateFoodCategory);
router.delete('/:id', deleteFoodCategory);

export default router;