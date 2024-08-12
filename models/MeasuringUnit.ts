import { DataTypes } from "sequelize";
import { sequelize } from "../db/SequalizeSetup";

export const MeasuringUnit = sequelize.define("MeasuringUnit", {
  measuringUnitId: { type: DataTypes.STRING, primaryKey: true, autoIncrement: false },
 
  measuringUnitName: {
    type: DataTypes.STRING,
    primaryKey: false,
    autoIncrement: false,
  }
});