import { Router } from "express";
import { categoriaGetClient } from "../controllers/categoriaControllersCliente";

const router = Router();

router.get("/", categoriaGetClient);

export default router;
