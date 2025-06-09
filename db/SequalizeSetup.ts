import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("htec", "root", "root", {
  host: process.env.DB_HOST,
  dialect: "mysql",
});
