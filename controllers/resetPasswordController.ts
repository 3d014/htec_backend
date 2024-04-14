import { Response } from "express";

const nodemailer = require("nodemailer");

// Create a Nodemailer transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});
// Email content
const mailOptions = {
  from: process.env.SMTP_USER, // Sender address
  to: "tuzlahtec@gmail.com", // Recipient's email address
  subject: "Forgot Password - Reset Link", // Subject line
  html: `
    <p>Dear User,</p>
    <p>We have received a request to reset your password. To do so, please use the following temporary password:</p>
    <p><strong>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</strong></p>
    <p>Once logged in, we recommend changing your password immediately.</p>
    <p>Thank you.</p>
  `,
};
export const reset_pawssword = (req: Request, res: Response) => {
  console.log("aaaaaaaaaaa");
  const { email } = req.body;
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred:");
      console.log(error.message);
    } else {
      console.log("Email sent successfully!");
      console.log("Message ID:", info.messageId);
    }
  });
};
