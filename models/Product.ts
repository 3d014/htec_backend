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
  categoryId: { // foreign key
    type: DataTypes.INTEGER,
    references: {
      model : 'Categories',
      key : 'categoryId',
    },
    primaryKey: false,
    autoIncrement: false,    
  },
  description: {
    type: DataTypes.STRING,
    primaryKey: false,
    autoIncrement: false,
  }
});

// Product is synchronized with latest ER Model
