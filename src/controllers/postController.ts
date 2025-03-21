import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ProtectedRequest } from "../middlewares/authMiddlewares";

const prisma = new PrismaClient();

export const getPost = async (req: ProtectedRequest, res: Response) => {
  try {
    const getAllPosts = await prisma.post.findMany();
    console.log("Posts: ", getAllPosts);
    res.status(201).render("posts", {
      message: "You have access, wellcome!",
      posts: getAllPosts,
    });
  } catch (error) {
    res.status(500).json({ message: "Couldn't get posts!" });
  }
};

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
        message: "Couldn't find a post with the same ID",
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

export const deletePost = async (req: ProtectedRequest, res: Response) => {
  try {
    console.log("Request.params", req.params);
    console.log("User ID", req.user?.id);
    const { id } = req.params;
    const userId = req.user?.id;

    const existingPostToDelete = await prisma.post.findUnique({
      where: {
        id: Number(id),
      },
    });
    console.log("hej", existingPostToDelete);

    if (!existingPostToDelete) {
      res.status(404).json({ message: "Couldn't find post!" });
      return;
    }

    if (existingPostToDelete.userId !== userId) {
      res
        .status(403)
        .json({ message: "You don't have permission to delete this post!" });
      return;
    }

    const deletePost = await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });
    console.log(deletePost);

    res.status(200).json({ message: "Post deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Couldn't delete the post right now" });
  }
};
