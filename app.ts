const express = require("express");
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize("htec", "root", "root", {
  host: "127.0.0.1",
  dialect: "mysql",
});
const authRoutes = require("./routes/authRoutes");
import cors from "cors";
import { userRouter } from "./controllers/UserController/userController";

export const app = express();
app.use(cors());
app.use(express.json());
// app.use(authRoutes);
app.use("/api/users/", userRouter);

(async () => {
  await sequelize.sync({ force: true });
  app.listen(5000, () => {
    console.log("App listening on port 5000");
  });
})();
