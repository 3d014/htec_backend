const express = require("express");
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("htec", "root", "root", {
  host: "127.0.0.1",
  dialect: "mysql",
});

import cors from "cors";
import { userRouter } from "./controllers/UserController/userController";
import { authRouter } from "./controllers/authController";

export const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users/", userRouter);
app.use("/api/auth/", authRouter);
(async () => {
  await sequelize.sync({ force: true });
  app.listen(5000, () => {
    console.log("App listening on port 5000");
  });
})();
