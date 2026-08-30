import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function ordersGetAdmin(req: Request, res: Response) {
  try {
    const buscarorder = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItem: {
          include: {
            product: true,
          },
        },
      },
    });

    return res.json(buscarorder);
  } catch (err) {
    console.error("erro ao ver os pedidos dos usuarios", err);
    return res
      .status(500)
      .json({ error: "erro ao ver os pedidos dos usuarios" });
  }
}

export async function ordersPathAdmin(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(404).json({ error: "Erro id não encontrado" });
    }
    const numberId = Number(id);

    if (isNaN(numberId)) {
      return res.status(400).json({ error: "Erro numero invalido" });
    }
    const buscarId = await prisma.order.findUnique({
      where: { id: numberId },
    });

    if (!buscarId) {
      return res.status(404).json({ error: "Id do pedido não encontrado" });
    }

    const statusValidos = [
      "PENDING",
      "PAID",
      "SHIPPED",
      "DELIVERED",
      "CANCELED",
    ];

    if (!statusValidos.includes(status)) {
      return res.status(400).json({ error: "Status invalido" });
    }
    const atualizar = await prisma.order.update({
      where: {
        id: numberId,
      },
      data: {
        status,
      },
    });

    return res.json(atualizar);
  } catch (err) {
    console.error("Erro a atualizar produto", err);
    return res.status(500).json({ error: "Erro a atualizar produto" });
  }
}
