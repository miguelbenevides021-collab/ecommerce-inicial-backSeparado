import { Router } from "express";
import {
  categoria,
  deleteCategorias,
} from "../controllers/categoriacontrollers";
import { authMiddlewares } from "../middlewares/authMiddlewares";
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

router.post("/", authMiddlewares, isAdmin, categoria);
router.delete("/:id", authMiddlewares, isAdmin, deleteCategorias);
export default router;
