import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { BlacklistToken } from "../models/TokenBlacklist";
import { AuthUser, Request } from "../interfaces/Request";


export const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).end();
  }
  const isBlacklisted = !!(await BlacklistToken.findOne({ where: { token } }));
  if (isBlacklisted) {
    return res.status(403).json({ success: false, msg: "Token blacklisted" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err, result) => {
    if (err) {
      return res.status(403).end();
    }
    req.user = result as AuthUser;
    next();
  });
};
