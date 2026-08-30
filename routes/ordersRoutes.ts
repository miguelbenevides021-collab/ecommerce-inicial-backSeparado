import { Router } from "express";
import { authMiddlewares } from "../middlewares/authMiddlewares";
import {
  ordersPostClient,
  ordersGetClient,
} from "../controllers/ordersControllersCliente";

const router = Router();

router.post("/", authMiddlewares, ordersPostClient);
router.get("/", authMiddlewares, ordersGetClient);
export default router;
