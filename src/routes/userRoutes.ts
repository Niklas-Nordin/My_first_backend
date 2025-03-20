import express from "express";
import {
  signUp,
  signIn,
  getSignUp,
  getSignIn,
} from "../controllers/userController";

const router = express.Router();

router.get("/signUp", getSignUp);
router.get("/signIn", getSignIn);

router.post("/signUp", signUp);
router.post("/signIn", signIn);

export default router;
