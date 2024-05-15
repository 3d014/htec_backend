import express, { Response, Request, Router } from "express";
import { Vendor } from "../../models/Vendor";
import { protectedRoute } from "../../middleware/auth-middleware";
import { Op } from "sequelize";


export const vendorRouter: Router = express.Router();

vendorRouter.get("/", protectedRoute, async (req: Request, res: Response) => {
    const { vendorId } = req.body;
   
    let vendor;
    if (!vendorId) {
      vendor = await Vendor.findAll();

    } else {
      vendor = await Vendor.findAll({
        where: {
          vendorId: { [Op.startsWith]: vendorId },
        },
      });
    }
    vendor.forEach((vendor: any) => {
        vendor.vendorTransactionNumber = vendor.vendorTransactionNumber.split(',').map((number: string) => number.trim());
    });

    vendor.forEach((vendor: any) => {
        vendor.vendorTelephone = vendor.vendorTelephone.split(',').map((number: string) => number.trim());
    });
    vendor.forEach((vendor: any) => {
        vendor.vendorEmail = vendor.vendorEmail.split(',').map((email: string) => email.trim());
    });
  
    return res.send(vendor);
  });

  

  vendorRouter.post("/", protectedRoute, async (req: Request, res: Response) => {
    const { vendorName, vendorAddress, vendorIdentificationNumber,vendorCategoryId, vendorPDVNumber, vendorCity, vendorTelephoneNumber, vendorEmail, vendorTransactionNumber } = req.body;

    try {
        const formattedTelephone = vendorTelephoneNumber?.join(',')||'';
        const formattedEmail = vendorEmail?.join(',')||'';
        const formattedTransactionNumber = vendorTransactionNumber?.join(',')||'';
        const newVendor = await Vendor.create({
            vendorName,
            vendorAddress,
            vendorIdentificationNumber,
            vendorPDVNumber,
            vendorCity,
            vendorCategoryId,
            vendorTelephone: formattedTelephone, 
            vendorEmail: formattedEmail, 
            vendorTransactionNumber: formattedTransactionNumber, 
        });

        return res.status(201).json(newVendor);
    } catch (error) {
        console.error("Error creating new vendor:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

