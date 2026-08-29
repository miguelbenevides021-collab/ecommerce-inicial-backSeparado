import { Router } from "express";
import { authMiddlewares } from "../middlewares/authMiddlewares";
import { isAdmin } from "../middlewares/isAdmin";
import {
  carrinhoGet,
  carrinhoPost,
  carrinhoDelete,
} from "../controllers/carrinhoControllers";
const router = Router();

router.post("/", authMiddlewares, carrinhoPost);
router.get("/", authMiddlewares, carrinhoGet);
router.delete("/:id", authMiddlewares, carrinhoDelete);

export default router;
