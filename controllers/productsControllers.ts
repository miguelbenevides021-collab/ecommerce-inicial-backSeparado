import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function creatProduct(req: Request, res: Response) {
  const { categoriaId, name, description, price, stock, brand } = req.body;
  try {
    if (!categoriaId || !name || !description || !price || !stock || !brand) {
      return res.status(400).json({
        error: "Coloque todos os requisitos para adicionar o produto",
      });
    }

    if (typeof price !== "number" || price < 0) {
      return res.status(400).json({ error: "Preço inválido" });
    }

    if (typeof stock !== "number" || stock < 0) {
      return res.status(400).json({ error: "Estoque inválido" });
    }

    const categoria = await prisma.categoria.findUnique({
      where: {
        id: categoriaId,
      },
    });

    if (!categoria) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }
    const product = await prisma.product.create({
      data: {
        categoriaId,
        name,
        description,
        price,
        stock,
        brand,
      },
    });

    return res.status(201).json({ message: "Produto criado com sucesso" });
  } catch (err) {
    console.error("Erro ao fazer o produto", err);
    return res.status(500).json({ error: "backend sem respostas" });
  }
}
