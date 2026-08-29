import { Router } from "express";
import {
  productsById,
  productsGet,
} from "../controllers/productsClientControllers";
const router = Router();

router.get("/", productsGet);
router.get("/:id", productsById);

export default router;
