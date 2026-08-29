import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function categoria(req: Request, res: Response) {
  const { name, slug } = req.body;

  try {
    if (!name || !slug) {
      return res.status(400).json({ error: "Preenche os requisitos" });
    }

    const nameNormal = name.toLowerCase().trim();
    const slugNormal = slug.toLowerCase().trim();
    const categorianame = await prisma.categoria.findUnique({
      where: {
        name: nameNormal,
      },
    });
    const categoriaslug = await prisma.categoria.findUnique({
      where: {
        slug: slugNormal,
      },
    });

    if (categorianame) {
      return res.status(409).json({ error: "Categoria ja existente" });
    }
    if (categoriaslug) {
      return res.status(409).json({ error: "Categoria ja existente" });
    }

    const criarCategoria = await prisma.categoria.create({
      data: {
        name: nameNormal,
        slug: slugNormal,
      },
    });

    return res.status(201).json(criarCategoria);
  } catch (err) {
    console.error("Error: ", err);
    return res.status(500).json({ error: "Erro ao criar categoria" });
  }
}
