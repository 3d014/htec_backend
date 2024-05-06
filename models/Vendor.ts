import { DataTypes } from "sequelize";
import { sequelize } from "../db/SequalizeSetup";


export const Vendors = sequelize.define("Vendors",{
    vendorId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    vendorName: {
        type: DataTypes.STRING,
        primaryKey: false,
        autoIncrement: false,
      },
      vendorAddress: {
        type: DataTypes.STRING,
        primaryKey: false,
        autoIncrement: false,
      },
      vendorIdentificationNumber: {
        type: DataTypes.STRING,
        primaryKey: false,
        autoIncrement: false,
      },
      vendorPDVNumber: {
        type: DataTypes.STRING,
        primaryKey: false,
        autoIncrement: false,
      },
      vendorCity: {
        type: DataTypes.STRING,
        primaryKey: false,
        autoIncrement: false,
      },
      vendorCategory:{
        type:DataTypes.STRING,
        primaryKey:false,
        autoIncrement:false,
      },
      vendorTelephone: {
        type: DataTypes.STRING,
        primaryKey: false,
        autoIncrement: false,
      },
      vendorEmail: {
        type: DataTypes.STRING,
        primaryKey: false,
        autoIncrement: false,
      },
      vendorTransactionNumber: {
        type: DataTypes.STRING,
        primaryKey: false,
        autoIncrement: false,
      },

})