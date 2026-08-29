import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function getProfile(req: Request, res: Response) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        role: true,
        createdAt: true,
        address: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "Usuario não encontrado" });
    }

    return res.json(user);
  } catch (err) {
    console.error("Error: ", err);
    return res.status(500).json({ error: "Erro ao ver perfil" });
  }
}
