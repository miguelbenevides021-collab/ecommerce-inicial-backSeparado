import { Router } from "express";
import {
  creatProduct,
  putProducts,
  deleteProductsAdmin,
} from "../controllers/productsControllers";
import { authMiddlewares } from "../middlewares/authMiddlewares";
import { isAdmin } from "../middlewares/isAdmin";

const router = Router();

router.post("/", authMiddlewares, isAdmin, creatProduct);
router.put("/:id", authMiddlewares, isAdmin, putProducts);
router.delete("/:id", authMiddlewares, isAdmin, deleteProductsAdmin);
export default router;
