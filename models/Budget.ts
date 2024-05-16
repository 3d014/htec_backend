import { DataTypes } from "sequelize";
import { sequelize } from "../db/SequalizeSetup";

export const Budget = sequelize.define("Budget",{
    budgetId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    totalBudget : {type: DataTypes.DECIMAL, primaryKey :false, autoIncrement : false},
    spentBudget  : {type: DataTypes.DECIMAL, primaryKey: false, autoIncrement :false},
    year : {type:DataTypes.STRING, primaryKey : false, autoIncrement : false},
    month : {type:DataTypes.STRING ,primaryKey : false, autoIncrement : false}, 
})