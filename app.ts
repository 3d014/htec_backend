const express = require("express");

import cors from "cors";
import { userRouter } from "./controllers/UserController/userController";
import { authRouter } from "./controllers/authController";
import { resetPasswordRouter } from "./controllers/resetPasswordController";
import { sequelize } from "./db/SequalizeSetup";
import { productsRouter } from "./controllers/productController";

export const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users/", userRouter);
app.use("/api/auth/", authRouter);
app.use("/api/reset/password/", resetPasswordRouter);
app.use("/api/products", productsRouter);
(async () => {
  await sequelize.sync({ force: true });
  app.listen(5000, () => {
    console.log("App listening on port 5000");
  });
})();
