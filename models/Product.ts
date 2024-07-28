import { DataTypes } from "sequelize";
import { sequelize } from "../db/SequalizeSetup";

export const Product = sequelize.define("Product", {
  productId: { type: DataTypes.STRING, primaryKey: true, autoIncrement: false },
  productName: {
    type: DataTypes.STRING,
    primaryKey: false,
    autoIncrement: false,
  },
  measuringUnitId: {
    type: DataTypes.STRING,
    primaryKey: false,
    autoIncrement: false,
  },
  categoryId: { // foreign key
    type: DataTypes.STRING,
    primaryKey: false,
    autoIncrement: false,    
  }
});

// Product is synchronized with latest ER Model
