import { createRestaurant, getRestaurant, getRestaurants, deleteRestaurant } from "../controllers/resturanController";
import { Router } from "express";

const router = Router();

router.post("/", createRestaurant);
router.get("/", getRestaurants);
router.get("/search", getRestaurant);
router.delete("/:id", deleteRestaurant);
export default router;