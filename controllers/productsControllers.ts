import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { error } from "node:console";

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

export async function putProducts(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, description, price, stock, brand } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Id não encontrado" });
    }

    const IdNumber = Number(id);

    if (isNaN(IdNumber)) {
      return res.status(400).json({ error: "Id não valido" });
    }

    const idproduct = await prisma.product.findUnique({
      where: { id: IdNumber },
    });

    if (!idproduct) {
      return res.status(400).json({ error: "Erro, produto nao encontrado" });
    }

    const putProductadmin = await prisma.product.update({
      where: { id: IdNumber },
      data: {
        name: name,
        description: description,
        price: price,
        stock: stock,
        brand: brand,
      },
    });
    return res.json(putProductadmin);
  } catch (err) {
    console.error("erro ao atualziar o produto", err);
    return res
      .status(500)
      .json({ error: "erro ao tentar atualizar o produto" });
  }
}

export async function deleteProductsAdmin(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "parametro invalido" });
    }

    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      return res.status(400).json({ error: "parametro invalido" });
    }

    const procurarProduct = await prisma.product.findUnique({
      where: { id: idNumber },
    });

    if (!procurarProduct) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const deletarProduct = await prisma.product.delete({
      where: { id: idNumber },
    });

    return res.json(deletarProduct);
  } catch (err) {
    console.error("Deletar o produto não foi possivel", err);
    return res
      .status(500)
      .json({ error: "Deletar o produto não foi possivel" });
  }
}
