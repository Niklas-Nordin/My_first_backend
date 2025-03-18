import express, { Request, Response } from "express";
import { signUp, signIn } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddlewares";
import { ProtectedRequest } from "../middlewares/authMiddlewares";
import { addPost, deletePost, updatePost } from "../controllers/postcontroller";

const router = express.Router();

router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.get(
  "/posts",
  authMiddleware,
  async (req: ProtectedRequest, res: Response) => {
    res.json({ message: "You have access, wellcome!", userId: req.user });
  }
);
router.post("/posts/create", authMiddleware, addPost);
router.patch("/posts/update/:id", authMiddleware, updatePost);
router.delete("/posts/delete/:id", authMiddleware, deletePost);

export default router;
