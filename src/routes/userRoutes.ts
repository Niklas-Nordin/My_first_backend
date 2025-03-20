import express from "express";
import { signUp, signIn } from "../controllers/userController";

const router = express.Router();

router.post("/signUp", signUp);
router.post("/signIn", signIn);

export default router;
