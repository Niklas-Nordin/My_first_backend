import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface ProtectedRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (
  req: ProtectedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: "Access denied!" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
    req.user = { id: decoded.id };
    console.log("req.user: ", req.user, token);
    next();
  } catch (error) {
    res.status(401).json({ message: "invalid token!" });
  }
};
