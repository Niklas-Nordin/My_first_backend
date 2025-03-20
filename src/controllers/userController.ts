import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
dotenv.config();

export const getSignUp = async (req: Request, res: Response) => {
  res.render("authForm", {
    action: "/users/signUp",
    btnText: "Sign Up",
    errors: {},
    inputValues: {},
  });
};

export const getSignIn = async (req: Request, res: Response) => {
  res.render("authForm", { action: "/users/signIn", btnText: "Sign In" });
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const {
      email,
      username,
      password,
      "confirm-password": confirmPassword,
    } = req.body;
    console.log(req.body);

    let errors: any = {};

    const userExist = await prisma.user.findFirst({
      where: {
        OR: [{ email: email }, { username: username }],
      },
    });

    if (userExist) {
      errors.username = "Username is already in use!";
    }

    if (confirmPassword !== password) {
      errors.password = "Passwords must match!";
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).render("authForm", {
        action: "/users/signUp",
        btnText: "Sign Up",
        errors,
        inputValues: { email, username },
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const createUser = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword,
      },
    });
    console.log(createUser);
    res.status(201).redirect("/");
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
