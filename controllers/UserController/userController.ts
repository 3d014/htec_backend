import express, { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../../models/User";


export const userRouter: Router = express.Router();
userRouter.post("/create", async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  try{
    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ success: false, msg: "Fields can't be empty" });
    }

    const userAlreadyExists = await User.findOne({ where: { email } });
    if (userAlreadyExists) {
      res.status(409).json({ success: false, msg: "User already exists" });
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

    res.status(200).json({ success: true, msg: "User sucessfully created" });
  }catch(error){
    console.error(error)
    return res.status(500).json({message:"Internal server error"})
  }
});

userRouter.delete("/", async (req: Request, res: Response) => {});
