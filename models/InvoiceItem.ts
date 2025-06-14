import { DataTypes } from "sequelize";
import { sequelize } from "../db/SequalizeSetup";
import {Invoice} from "./Invoice"


export const InvoiceItem = sequelize.define("InvoiceItem",{
    invoiceItemId:{
        type:DataTypes.STRING,primaryKey:true,autoIncrement:false
    },
    invoiceId: {
      type: DataTypes.STRING,
      references: {
        model: Invoice,
        key: 'invoiceId'
      },
      onDelete: 'CASCADE' 
    },
      quantity: {
        type: DataTypes.INTEGER,
        primaryKey: false,
        autoIncrement: false,
      },
      priceWithoutPdv: {
        type: DataTypes.DECIMAL(10,3),
        primaryKey: false,
        autoIncrement: false,
      },
      priceWithPdv: {
        type: DataTypes.DECIMAL(10,3),
        primaryKey: false,
        autoIncrement: false,
      },
      sumWithoutPdv: {
        type: DataTypes.DECIMAL(10,3),
        primaryKey: false,
        autoIncrement: false,
      },
      sumWithPdv: {
        type: DataTypes.DECIMAL(10,3),
        primaryKey: false,
        autoIncrement: false,
      },
      discount: {
        type: DataTypes.DECIMAL(10,3),
        primaryKey: false,
        autoIncrement: false,
      },
      productId: {
        type: DataTypes.STRING,
        primaryKey: false,
        autoIncrement: false,
      },
      productCode:{
        type:DataTypes.STRING,
        primaryKey:false,
        autoIncrement:false
      }
});

