import express from "express";
import { authMiddleware } from "../middlewares/authMiddlewares";
import {
  addPost,
  deletePost,
  updatePost,
  getPost,
  getPostsForm,
} from "../controllers/postController";

const router = express.Router();

router.get("/", authMiddleware, getPost);
router.get("/update/:id", authMiddleware, getPostsForm);
router.get("/create", authMiddleware, getPostsForm);

router.post("/create", authMiddleware, addPost);
router.post("/update/:id", authMiddleware, updatePost);
router.delete("/delete/:id", authMiddleware, deletePost);

export default router;
