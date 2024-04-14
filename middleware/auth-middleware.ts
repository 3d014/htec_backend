// require("dotenv").config();

// import jwt from "jsonwebtoken";

// export const createToken = (user) => {
//   const payload = {
//     email: user.email,
//   };

//   const secret = process.env.JWT_SECRET_KEY;
//   const options = { expiresIn: "1h" };

//   return jwt.sign(payload, secret, options);
// };

// export const requireAuth = (req, res, next) => {
//   const token = req.cookies.jwt;
//   if (!token) {
//     return res.redirect("/api/login");
//   }

//   jwt.verify(token, "your-secret-key", (err, result) => {
//     if (err) {
//       return res.redirect("/api/login");
//     }
//     next();
//   });
// };
