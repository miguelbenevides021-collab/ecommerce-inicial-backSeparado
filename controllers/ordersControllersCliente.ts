import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function ordersPostClient(req: Request, res: Response) {
  try {
    const buscarCarrinho = await prisma.cart.findFirst({
      where: { userId: req.user!.id },
      include: {
        cartItem: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!buscarCarrinho) {
      return res.status(404).json({ error: "erro ao encontrar o carrinho" });
    }
    if (buscarCarrinho.cartItem.length === 0) {
      return res.status(400).json({ error: "Carrinho está vazio" });
    }
    const total = buscarCarrinho.cartItem.reduce((acumulador, item) => {
      return acumulador + Number(item.product.price) * item.quantity;
    }, 0);

    const criarOrder = await prisma.order.create({
      data: {
        userId: req.user!.id,
        total: total,
      },
    });

    for (const item of buscarCarrinho.cartItem) {
      await prisma.orderItem.create({
        data: {
          orderId: criarOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price,
        },
      });
    }

    return res.json(criarOrder);
  } catch (err) {
    console.error("Erro ao fazer o pedido", err);
    return res.status(500).json({ error: "Erro ao fazer o pedido " });
  }
}

export async function ordersGetClient(req: Request, res: Response) {
  try {
    const verpedido = await prisma.order.findMany({
      where: { userId: req.user!.id },
      include: {
        orderItem: {
          include: {
            product: true,
          },
        },
      },
    });

    return res.json(verpedido);
  } catch (err) {
    console.error("Erro ao buscar pedidos", err);
    return res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
}
