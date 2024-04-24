import { DataTypes } from "sequelize";
import { sequelize } from "../db/SequalizeSetup";

export const Product = sequelize.define("Product", {
  productId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  productName: {
    type: DataTypes.STRING,
    primaryKey: false,
    autoIncrement: false,
  },
  measuringUnit: {
    type: DataTypes.STRING,
    primaryKey: false,
    autoIncrement: false,
  },
});
