import { DataTypes } from "sequelize";
import { sequelize } from "../db/SequalizeSetup";

export const Categories = sequelize.define("Categories",{
    categoryId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    categoryName: {
        type: DataTypes.STRING,
        primaryKey: false,
        autoIncrement: false,
    }
})

// Category is synchronoized with latest ER Model