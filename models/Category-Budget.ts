import { DataTypes } from "sequelize";
import { sequelize } from "../db/SequalizeSetup";

export const CategoryBudget = sequelize.define("Category_Budget",{
    id:{type: DataTypes.INTEGER, primaryKey : true, autoIncrement : true},
    categoryId: {
        type: DataTypes.INTEGER, 
        primaryKey: false, 
        autoIncrement: false,
        references: {
            model: 'Category', 
            key: 'categoryId', 
         }

    }, // foreign key
    budgetId : {
        type : DataTypes.INTEGER,
        primaryKey : false,
        autoIncrement : false,
        references: {
            model: 'Budget', 
            key: 'budgetId', 
        }
     }, // foreign key
    percentage : {type : DataTypes.DECIMAL, primaryKey : false, autoIncrement : false},
})