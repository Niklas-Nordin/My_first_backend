import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
dotenv.config();

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
      return;
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

export const signIn = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      res.status(400).json({ message: "Wrong username or password" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      res.status(401).json({ message: "Wrong username or password" });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.json({ message: "Sign in success!", token });
  } catch (error) {
    res.status(500).json({ message: "Something weent wrong" });
  }
};
