import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function categoriaGetClient(req: Request, res: Response) {
  try {
    const categoriaexiste = await prisma.categoria.findMany();
    return res.json(categoriaexiste);
  } catch (err) {
    console.error("erro ao encontrar categorias", err);
    return res.status(500).json({ error: "erro ao buscar categorias" });
  }
}
