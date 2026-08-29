import { Router } from "express";
import { creatProduct } from "../controllers/productsControllers";
import { authMiddlewares } from "../middlewares/authMiddlewares";
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

router.post("/", authMiddlewares, isAdmin, creatProduct);
export default router;
