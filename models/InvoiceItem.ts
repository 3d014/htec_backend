import { DataTypes } from "sequelize";
import { sequelize } from "../db/SequalizeSetup";


export const InvoiceItem = sequelize.define("InvoiceItem",{
    invoiceItemId:{
        type:DataTypes.STRING,primaryKey:true,autoIncrement:false
    },
    invoiceId: { type: DataTypes.STRING, primaryKey: false, autoIncrement: false },
      quantity: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        autoIncrement: false,
      },
      priceWithoutPdv: {
        type: DataTypes.DECIMAL,
        primaryKey: false,
        autoIncrement: false,
      },
      priceWithPdv: {
        type: DataTypes.DECIMAL,
        primaryKey: false,
        autoIncrement: false,
      },

      sumWithoutPdv: {
        type: DataTypes.DECIMAL,
        primaryKey: false,
        autoIncrement: false,
      },
      sumWithPdv: {
        type: DataTypes.DECIMAL,
        primaryKey: false,
        autoIncrement: false,
      },

      discount: {
        type: DataTypes.DECIMAL,
        primaryKey: false,
        autoIncrement: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        autoIncrement: false,
      },


})