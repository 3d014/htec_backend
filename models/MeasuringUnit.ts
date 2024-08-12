import { DataTypes } from "sequelize";
import { sequelize } from "../db/SequalizeSetup";

export const MeasuringUnit = sequelize.define("MeasuringUnit", {
  measuringUnitId: { type: DataTypes.STRING, primaryKey: true, autoIncrement: false },
<<<<<<< HEAD
 
=======
>>>>>>> d2a19b2948b5a4ab194e9489241193b0718dbc10
  measuringUnitName: {
    type: DataTypes.STRING,
    primaryKey: false,
    autoIncrement: false,
  }
});