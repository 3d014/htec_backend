import bcrypt from "bcrypt";
import { User } from "../models/User";
import express, { Router } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { BlacklistToken } from "../models/TokenBlacklist";
import { Model } from "sequelize";
import { User as UserType } from "../interfaces/User";
import { protectedRoute } from "../middleware/auth-middleware";
import { Request as AuthRequest } from "../interfaces/Request";
dotenv.config();

export const authRouter: Router = express.Router();

authRouter.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user: Model<UserType> | null = await User.findOne({
    where: { email },
  });

  if (!user) {
    return res
      .status(401)
      .json({ success: false, msg: "Incorrect password or email" });
  }
  const auth = await bcrypt.compare(password, user.dataValues.pw);
  if (!auth) {
    return res
      .status(401)
      .json({ success: false, msg: "Incorrect password or email" });
  }
  console.log("test", user.dataValues);

  const token = jwt.sign(
    {
      firstName: user.dataValues.firstName,
      lastName: user.dataValues.lastName,
      email: user.dataValues.email,
      role: user.dataValues.userRole,
    },
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: "1h",
    }
  );

  return res.status(200).json({ success: true, token });
});

authRouter.delete("/logout", (req: Request, res: Response) => {
  const { token } = req.body;
  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    );

    BlacklistToken.create({ token });
    return res.status(200).end();
  } catch (e) {
    console.error("error verifying token", e);
    return res
      .status(403)
      .json({ success: false, msg: "error verifying token" });
  }
});

authRouter.get("/test", protectedRoute, (req: AuthRequest, res: Response) => {
  return res.send(`hello from protected ${req.user?.firstName}`);
});
