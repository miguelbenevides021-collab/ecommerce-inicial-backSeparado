import { Router } from "express";
import { authMiddlewares } from "../middlewares/authMiddlewares";

import {
  carrinhoGet,
  carrinhoPost,
  carrinhoDelete,
  putCarrinhoControllers,
} from "../controllers/carrinhoControllers";
const router = Router();

router.post("/", authMiddlewares, carrinhoPost);
router.get("/", authMiddlewares, carrinhoGet);
router.delete("/:id", authMiddlewares, carrinhoDelete);
router.put("/:id", authMiddlewares, putCarrinhoControllers);

export default router;
