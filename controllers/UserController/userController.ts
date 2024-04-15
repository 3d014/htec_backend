import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../../models/User";

// /api/users
export const userRouter: Router = express.Router();
userRouter.post("/create", async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({ success: false, msg: "Fields can't be empty" });
  }

  const userAlreadyExists = await User.findOne({ where: { email } });
  if (userAlreadyExists) {
    res.status(400).json({ success: false, msg: "User already exists" });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = await bcrypt.hash(password, salt);
  User.create({
    firstName,
    lastName,
    email,
    pw: passwordHash,
    resetPwLink: "test",
    userRole: "user",
  });

  res.status(201).json({ success: true, msg: "User sucessfully added" });
});

userRouter.delete("/", async (req: Request, res: Response) => {
  // const { email } = req.body;
  // const user = await User.findOne({ where: { email } });
  // if (!user) {
  //   res.status(400).json({ success: false, msg: "User doesn't exist" });
  // }
  // const userDestroyed = await user.destroy();
  // if (!userDestroyed) {
  //   res.status(400).json({ success: false, msg: "Something went wrong" });
  // }
  // res.status(200).json({ success: true, msg: "User removed from database" });
});
