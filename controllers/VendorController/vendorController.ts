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
        // Convert array of telephone numbers to comma-separated string
        const formattedTelephone = vendorTelephoneNumber?.join(',')||'';

        // Convert array of email addresses to comma-separated string
        const formattedEmail = vendorEmail?.join(',')||'';

        // Convert array of transaction numbers to comma-separated string
        const formattedTransactionNumber = vendorTransactionNumber?.join(',')||'';

        // Create a new vendor record in the database
        const newVendor = await Vendor.create({
            vendorName,
            vendorAddress,
            vendorIdentificationNumber,
            vendorPDVNumber,
            vendorCity,
            vendorCategoryId,
            vendorTelephone: formattedTelephone, // Store telephone numbers as comma-separated string
            vendorEmail: formattedEmail, // Store email addresses as comma-separated string
            vendorTransactionNumber: formattedTransactionNumber, // Store transaction numbers as comma-separated string
        });

        return res.status(201).json(newVendor);
    } catch (error) {
        console.error("Error creating new vendor:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});