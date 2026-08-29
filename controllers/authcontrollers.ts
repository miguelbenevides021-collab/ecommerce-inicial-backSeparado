import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += Number(cpf[i]) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== Number(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += Number(cpf[i]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== Number(cpf[10])) return false;

  return true;
}

export async function register(req: Request, res: Response) {
  const { name, email, password, cpf, address } = req.body;
  try {
    if (!name || !email || !password || !cpf || !address) {
      return res.status(400).json({ error: "Preenche todos os dados" });
    }

    if (password.length < 10) {
      return res.status(400).json({ error: "Senha fraca" });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }

    const cpfLimpo = cpf.replace(/\D/g, "");
    if (!isValidCPF(cpfLimpo)) {
      return res.status(400).json({ error: "CPF inválido" });
    }

    const emailNormalizado = email.toLowerCase().trim();

    const userExiste = await prisma.user.findUnique({
      where: { email: emailNormalizado },
    });
    if (userExiste) {
      return res.status(409).json({ error: "Usuario já existente!" });
    }

    const cpfExiste = await prisma.user.findUnique({
      where: { cpf: cpfLimpo },
    });
    if (cpfExiste) {
      return res.status(409).json({ error: "CPF já cadastrado" });
    }

    const senha = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: emailNormalizado,
        password: senha,
        cpf: cpfLimpo,
        address: {
          create: {
            rua: address.rua,
            numero: address.numero,
            bairro: address.bairro,
            cidade: address.cidade,
            cep: address.cep,
            estado: address.estado,
            complemento: address.complemento,
          },
        },
      },
    });

    return res.status(201).json({ message: "Usuario criado com sucesso!" });
  } catch (err: any) {
    if (err.code === "P2002") {
      const campo = err.meta?.target?.[0] ?? "dado";
      return res.status(409).json({ error: `${campo} já cadastrado` });
    }
    console.error("Erro ao criar o usuario", err);
    return res.status(500).json({ error: "Usuario não criado" });
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Preenche todos os dados" });
    }

    const emailNormalizado = email.toLowerCase().trim();

    const userExiste = await prisma.user.findUnique({
      where: { email: emailNormalizado },
    });

    if (!userExiste) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const senhaCorreta = await bcrypt.compare(password, userExiste.password);
    if (!senhaCorreta) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET não configurado no .env");
    }

    const token = jwt.sign(
      { id: userExiste.id, role: userExiste.role },
      secret,
      {
        expiresIn: "7d",
      },
    );

    return res.json({ token });
  } catch (err) {
    console.error("erro: ", err);
    return res.status(500).json({ error: "Erro ao fazer login" });
  }
}
