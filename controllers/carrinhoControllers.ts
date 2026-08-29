import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function carrinhoGet(req: Request, res: Response) {
  try {
    const cart = await prisma.cart.findFirst({
      where: { userId: req.user!.id },
      include: {
        cartItem: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return res.json({ cartItem: [] });
    }

    return res.json(cart);
  } catch (err) {
    console.error("Erro ao mostrar carrinho", err);
    return res.status(500).json({ error: "Erro ao mostrar carrinho" });
  }
}

export async function carrinhoPost(req: Request, res: Response) {
  const { productId, quantity } = req.body;
  try {
    if (!productId || !quantity) {
      return res.status(400).json({ error: "Requisitos não enviados" });
    }

    if (typeof productId !== "number" || productId < 0) {
      return res.status(400).json({ error: "Valor invalido" });
    }
    if (typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({ error: "Valor invalido" });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    let cart = await prisma.cart.findFirst({
      where: { userId: req.user!.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: req.user!.id },
      });
    }

    const itemExistente = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    let cartItem;

    if (itemExistente) {
      cartItem = await prisma.cartItem.update({
        where: { id: itemExistente.id },
        data: {
          quantity: itemExistente.quantity + quantity,
        },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity,
        },
      });
    }

    return res.status(201).json({ cartItem });
  } catch (err) {
    console.error("Erro ao adicionar ao carrinho", err);
    return res.status(500).json({ error: "Erro ao adicionar ao carrinho" });
  }
}

export async function carrinhoDelete(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Id não encontrado" });
    }

    const idnumber = Number(id);

    if (isNaN(idnumber)) {
      return res.status(400).json({ error: "Id invalido" });
    }

    const cartProduct = await prisma.cartItem.findFirst({
      where: { id: idnumber },
      include: {
        cart: true,
      },
    });

    if (!cartProduct) {
      return res.status(404).json({ error: "id produto nao encontrado" });
    }

    if (cartProduct.cart.userId !== req.user!.id) {
      return res
        .status(403)
        .json({ error: "voce nao pode deletar este produto" });
    }

    const deletar = await prisma.cartItem.delete({
      where: {
        id: idnumber,
      },
    });

    return res.json(deletar);
  } catch (err) {
    console.error("Erro ao deletar", err);
    return res.status(500).json({ error: "Erro ao deletar" });
  }
}
