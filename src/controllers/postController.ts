import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ProtectedRequest } from "../middlewares/authMiddlewares";
import { formatDistanceToNow } from "date-fns";
import { enUS, sv } from "date-fns/locale";

const prisma = new PrismaClient();

export const getPost = async (req: ProtectedRequest, res: Response) => {
  try {
    const getAllPosts = await prisma.post.findMany();
    console.log("Posts: ", getAllPosts);

    const timeTakerPosts = getAllPosts.map((post) => {
      return {
        ...post,
        postTime: formatDistanceToNow(post.time, {
          addSuffix: true,
          locale: enUS,
        }).replace("about ", ""),
      };
    });

    res.status(201).render("posts", {
      message: "You have access, wellcome!",
      posts: timeTakerPosts,
    });
  } catch (error) {
    res.status(500).json({ message: "Couldn't get posts!" });
  }
};

export const getPostsForm = async (req: ProtectedRequest, res: Response) => {
  try {
    const { id } = req.params;
    console.log(id);
    let action = "/posts/create";
    let btnText = "Create";
    let inputValues = { title: "", content: "" };

    if (id) {
      const post = await prisma.post.findUnique({
        where: { id: Number(id) },
      });
      console.log(id);

      if (post) {
        action = `/posts/update/${id}`;
        btnText = "Save";
        inputValues = {
          title: post.title,
          content: post.content,
        };
      }
    }
    res.render("postsForm", {
      action,
      btnText,
      errors: {},
      inputValues,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const addPost = async (req: ProtectedRequest, res: Response) => {
  try {
    const time = new Date();
    const userId = req.user?.id;
    const { title, content } = req.body;
    const newPost = await prisma.post.create({
      data: {
        title: title,
        content: content,
        time: time,
        userId: userId,
      },
    });

    console.log(newPost);
    res.status(201).redirect("/posts");
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
    console.log(update);
    res.status(200).redirect("/posts");
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

    res.status(200).redirect("/posts");
  } catch (error) {
    res.status(500).json({ message: "Couldn't delete the post right now" });
  }
};
