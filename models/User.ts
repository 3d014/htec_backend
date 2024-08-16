import { sequelize } from "../db/SequalizeSetup";
import { DataTypes } from "sequelize";


export const User = sequelize.define("User", {
  userId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: {
    type: DataTypes.STRING,
    primaryKey: false,
    autoIncrement: false,
  },
  lastName: { type: DataTypes.STRING, primaryKey: false, autoIncrement: false },
  email: { type: DataTypes.STRING, primaryKey: false, autoIncrement: false },
  pw: { type: DataTypes.STRING, primaryKey: false, autoIncrement: false },
  createdAt: { type: DataTypes.DATE, primaryKey: false, autoIncrement: false },
  updatedAt: { type: DataTypes.DATE, primaryKey: false, autoIncrement: false },
  resetPwLink: {
    type: DataTypes.STRING,
    primaryKey: false,
    autoIncrement: false,
  },
  userRole: { type: DataTypes.STRING, primaryKey: false, autoIncrement: false },
});

