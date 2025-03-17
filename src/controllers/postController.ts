import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ProtectedRequest } from "../middlewares/authMiddlewares";

const prisma = new PrismaClient();

const addPost = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title, content } = req.body;
    const newPost = await prisma.post.create({
      data: {
        title: title,
        content: content,
        userId: userId,
      },
    });
    res.status(201).json({ Message: "Post created!", newPost });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit post!" });
  }
};

export default addPost;
