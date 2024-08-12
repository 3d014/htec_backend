import express, { Response, Request, Router } from "express";
import { User } from "../models/User";
import { Model } from "sequelize";
import { UserType } from "../interfaces/User";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";


export const resetPasswordRouter: Router = express.Router();



const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});



resetPasswordRouter.post("/getlink", async (req: Request, res: Response) => {
  const { email } = req.body;
  const user: Model<UserType> | null = await User.findOne({ where: { email } });
  if (!user) {
    return res
      .status(404)
      .json({ success: false, msg: "User with that email in database" });
  }
  await user.update({ resetPwLink: crypto.randomBytes(32).toString("hex") });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: email,
    subject: "Forgot Password - Reset Link",
    html: `
      <p>Dear ${user.dataValues.firstName},</p>
      <p>We have received a request to reset your password. To do so, please use the following temporary link:</p>
      <p><strong>${process.env.APP_URL}/resetpassword?token=${user.dataValues.resetPwLink}</strong></p>
      <p>Once logged in, we recommend changing your password immediately.</p>
      <p>Thank you.</p>
    `,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({
        success: false,
        msg: "Email was not sent due to some internal error!",
        error: error.message,
      });
    } else {
      return res.status(200).json({
        success: true,
        msg: "Email was succesfuly sent!",
        info: info.messageId,
      });
    }
  });
  console.log("token for pw reset", user.dataValues.resetPwLink);
});

resetPasswordRouter.post("/checktoken", async (req: Request, res: Response) => {
  const { token } = req.body;
  const user = await User.findOne({ where: { resetPwLink: token } });
  if (!user) {
    return res
      .status(404)
      .json({ success: false, msg: "Invalid reset token!" });
  }
  res.status(200).end();
});

resetPasswordRouter.post(
  "/resetpassword",
  async (req: Request, res: Response) => {
    const { password1, password2, token } = req.body;
    const user: Model<UserType> | null = await User.findOne({
      where: { resetPwLink: token },
    });
    if (password1 !== password2) {
      return res
        .status(400)
        .json({ success: false, msg: "Passwords must match!" });
    }
    if (!user) {
      return res.status(401).json({ success: false, msg: "Invalid token!" });
    }
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = await bcrypt.hash(password1, salt);
    try {
      await user.update({ pw: passwordHash, resetPwLink: "" });

      return res
        .status(200)
        .json({ success: true, msg: "Password reset was successful!" });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: "Password reset was not successful!" });
    }
  }
);
