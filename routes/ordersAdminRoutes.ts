import { Router } from "express";
import { authMiddlewares } from "../middlewares/authMiddlewares";
import { isAdmin } from "../middlewares/isAdmin";
import { ordersGetAdmin, ordersPathAdmin } from "../controllers/ordersAdmin";

const router = Router();

router.get("/", authMiddlewares, isAdmin, ordersGetAdmin);
router.patch("/:id", authMiddlewares, isAdmin, ordersPathAdmin);
export default router;
