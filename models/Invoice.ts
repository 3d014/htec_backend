import { DataTypes } from "sequelize";
import { sequelize } from "../db/SequalizeSetup";


export const Invoice = sequelize.define("Invoice",{
    invoiceId: { type: DataTypes.STRING, primaryKey: true },

    vendorId: {
        type: DataTypes.STRING,
        primaryKey: false,
        autoIncrement: false,
      },

      invoiceNumber:{
        type:DataTypes.STRING,
        primaryKey:false,
        autoIncrement:false
      },

      dateOfIssue:{
        type:DataTypes.DATE,
        primaryKey:false,
        autoIncrement:false
      },
      dateOfPayment:{
        type:DataTypes.DATE,
        primaryKey:false,
        autoIncrement:false
      },
      
      totalValueWithoutPdv:{
        type:DataTypes.DECIMAL(10,3),
        primaryKey:false,
        autoIncrement:false
      },
      totalValueWithPdv:{
        type:DataTypes.DECIMAL(10,3),
        primaryKey:false,
        autoIncrement:false
      },
      pdvValue:{
        type:DataTypes.DECIMAL(10,3),
        primaryKey:false,
        autoIncrement:false
      }
      

})