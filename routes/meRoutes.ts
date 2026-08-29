import { Router } from "express";
import { authMiddlewares } from "../middlewares/authMiddlewares";

import { getProfile } from "../controllers/profileControllers";

const router = Router();

router.get("/", authMiddlewares, getProfile);

export default router;
