import { DataTypes } from "sequelize";
import { sequelize } from "../db/SequalizeSetup";

export const Budget = sequelize.define("Budget",{
    budgetId: { type: DataTypes.STRING, primaryKey: true, autoIncrement: false },
    totalBudget : {type: DataTypes.DECIMAL(10,3), primaryKey :false, autoIncrement : false},
    spentBudget  : {type: DataTypes.DECIMAL(10,3), primaryKey: false, autoIncrement :false},
    year : {type:DataTypes.STRING, primaryKey : false, autoIncrement : false},
    month : {type:DataTypes.STRING ,primaryKey : false, autoIncrement : false}, 
})