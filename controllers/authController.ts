// import bcrypt from "bcrypt";
// import { User } from "../models/User";
// import { createToken } from "../middleware/auth-middleware";
// import { Request, Response } from "express";

// // create_user funkcija ce se pozivati na post request za kreiranje korisnika

// const login_user = async (req: Request, res: Response) => {
//   const { email, sifra } = req.body;
//   const user = await User.findOne({ where: { email } });

//   if (!user) {
//     return res.status(400);
//   }
//   const auth = await bcrypt.compare(sifra, user.pw);
//   if (!auth) {
//     return res.status(400).json({ success: false, msg: "Incorrect password" });
//   }

//   const token = createToken(user);
//   res.send({ token });
//   return res.status(200).json({ success: true, msg: `Welcome ${user.ime}` });
// };

// const logout_user = (req: Request, res: Response) => {
//   res.cookie("jwt", "", { maxAge: 1 });
//   res.redirect("/api/login");
// };

// export { login_user, logout_user };
