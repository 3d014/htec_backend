import { DataTypes } from "sequelize";
import { sequelize } from "../db/SequalizeSetup";

export const BlacklistToken = sequelize.define("BlacklistToken", {
  token: { type: DataTypes.STRING, primaryKey: false, autoIncrement: false },
});
