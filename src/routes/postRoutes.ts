import express from "express";
import { authMiddleware } from "../middlewares/authMiddlewares";
import {
  addPost,
  deletePost,
  updatePost,
  getPost,
} from "../controllers/postController";

const router = express.Router();

router.get("/", authMiddleware, getPost);
router.post("/create", authMiddleware, addPost);
router.put("/update/:id", authMiddleware, updatePost);
router.delete("/delete/:id", authMiddleware, deletePost);

export default router;
