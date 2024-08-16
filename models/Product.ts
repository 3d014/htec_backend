import { DataTypes } from "sequelize";
import { sequelize } from "../db/SequalizeSetup";
import { Category } from "./Category";

export const Product = sequelize.define("Product", {
  productId: { type: DataTypes.STRING, primaryKey: true, autoIncrement: false },
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
  categoryId: { 
    type: DataTypes.STRING,
    primaryKey: false,
    autoIncrement: false,   
    references: {
      model: Category,
      key: 'categoryId'
    }  
  }
});

