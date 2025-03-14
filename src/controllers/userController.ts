import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    const userExist = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (userExist) {
      res
        .status(400)
        .send(
          "There is already an exsting account with this email or username"
        );
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const createUser = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: "User created", user: createUser });
  } catch (error) {
    res.status(500).json({ message: "Couldn't create that user..." });
  }
};
