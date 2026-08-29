import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function productsGet(req: Request, res: Response) {
  try {
    const produtos = await prisma.product.findMany();
    return res.json(produtos);
  } catch (err) {
    console.error("erro ao ver produtos", err);
    return res.status(500).json({ error: "erro ao ver produtos" });
  }
}

export async function productsById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Id nao encontrado" });
    }

    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      return res.status(400).json({ error: "id invalido" });
    }

    const productById = await prisma.product.findUnique({
      where: { id: idNumber },
    });

    if (!productById) {
      return res.status(404).json({ error: "Produto nao encontrado" });
    }
    return res.json(productById);
  } catch (err) {
    console.error("erro ano ver produto", err);
    return res.status(500).json({ error: "erro ao procurar produto" });
  }
}
