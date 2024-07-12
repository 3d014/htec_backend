import { DataTypes } from "sequelize";
import { sequelize } from "../db/SequalizeSetup";

export const Category = sequelize.define("Category",{
    categoryId: { type: DataTypes.STRING, primaryKey: true, autoIncrement: false },
    categoryName: {
        type: DataTypes.STRING,
        primaryKey: false,
        autoIncrement: false,
    }
})

