import { DataTypes } from "sequelize";
import { sequelize } from "../db/SequalizeSetup";
import { Budget } from "./Budget";

export const CategoryBudget = sequelize.define("Category_Budget",{
    categoryBudgetId:{type: DataTypes.STRING, primaryKey : true, autoIncrement : false},
    categoryId: {
        type: DataTypes.STRING, 
        primaryKey: false, 
        autoIncrement: false,
    }, 
    budgetId : {
        type : DataTypes.STRING,
        primaryKey : false,
        autoIncrement : false,
        references: {
            model: Budget,
            key: 'budgetId'
          },
          onDelete: 'CASCADE'  
     },
    totalValue : {type : DataTypes.DECIMAL(6,3), primaryKey : false, autoIncrement : false},
    spentValue : {type: DataTypes.DECIMAL(6,3), primaryKey : false, autoIncrement : false}
});