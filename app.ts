import express from "express";
import Cors from "cors";
import "dotenv/config";
import rateLimit from "express-rate-limit";

import authRota from "./routes/authRoutes";
import profile from "./routes/meRoutes";
import createProducts from "./routes/productsRoutes";
import categoriaRoute from "./routes/categoriaRoutes";
import carrinhoRoutes from "./routes/carrinhoRoutes";
import produtosGetRoutes from "./routes/productsClientRoutes";
import CategoriasClienteRoutes from "./routes/categoriaClienteRoutes";
import OrderRoutes from "./routes/ordersRoutes";
import AdminOrdersRoutes from "./routes/ordersAdminRoutes";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(express.json());
app.use(Cors());
app.use(limiter);

app.use("/auth", authRota);
app.use("/profile", profile);
app.use("/carrinho", carrinhoRoutes);
app.use("/products", produtosGetRoutes);
app.use("/categories", CategoriasClienteRoutes);
app.use("/orders", OrderRoutes);
app.use("/admin/orders", AdminOrdersRoutes);
app.use("/admin/products", createProducts);
app.use("/admin/categories", categoriaRoute);

app.get("/", (req, res) => {
  res.json("API FUNCIONANDO COM SUCESSO!");
});

export default app;
