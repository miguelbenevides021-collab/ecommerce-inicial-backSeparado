import { Router } from "express";
import { categoria } from "../controllers/categoriacontrollers";
import { authMiddlewares } from "../middlewares/authMiddlewares";
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

router.post("/", authMiddlewares, isAdmin, categoria);

export default router;
