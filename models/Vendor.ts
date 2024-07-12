import { DataTypes } from "sequelize";
import { sequelize } from "../db/SequalizeSetup";


export const Vendor = sequelize.define("Vendor",{
    vendorId: { type: DataTypes.STRING, primaryKey: true, autoIncrement: false },
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
      supportsAvans : {
        type : DataTypes.BOOLEAN,
        primaryKey : false,
        autoIncrement : false,
      }


})

// Vendor is synchronized with latest ER Model