import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ProtectedRequest } from "../middlewares/authMiddlewares";

const prisma = new PrismaClient();

export const addPost = async (req: ProtectedRequest, res: Response) => {
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

export const updatePost = async (req: ProtectedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title, content } = req.body;
    const { id } = req.params;

    const existingPost = await prisma.post.findUnique({
      where: { id: Number(id) },
    });

    if (!existingPost) {
      res.status(404).json({
        message: "Couldn't fin a post with the same ID",
      });
    }

    if (existingPost?.userId !== userId) {
      res.status(403).json({ message: "You are not able to edit this post!" });
      return;
    }

    const update = await prisma.post.update({
      where: {
        id: Number(id),
      },
      data: {
        ...(title && { title }),
        ...(content && { content }),
      },
    });
    res.status(200).json(update);
  } catch (error) {
    res.status(500).json({ message: "couldn't update the post right now!" });
  }
};
