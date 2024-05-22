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
          vendorId: req.body.vendorId,
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
  
    return res.status(200).json(vendor);
  });

  

  vendorRouter.post("/", protectedRoute, async (req: Request, res: Response) => {
    const { vendorName, vendorAddress, vendorIdentificationNumber,vendorPDVNumber, vendorCity, vendorTelephoneNumber, vendorEmail, vendorTransactionNumber,supportsAvans } = req.body;

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
            vendorTelephone: formattedTelephone, 
            vendorEmail: formattedEmail, 
            vendorTransactionNumber: formattedTransactionNumber, 
            supportsAvans
        });

        return res.status(200).json({success:true, message:"Vendor created successfully"});
    } catch (error) {
        console.error("Error creating new vendor:", error);
        return res.status(500).json({success: false, message: "Internal server error" });
    }
});


vendorRouter.delete('/', protectedRoute, async (req:Request, res: Response) =>{
  const {vendorId} = req.body;

  try{
    if(vendorId){
      await Vendor.destroy({
        where:{
          vendorId : req.body.vendorId,
        } 
      })
    .then(() => {
      return res.status(200).json({sucess: true, message: "Vendor deleted successfully"});

    })

    .catch(() => {
      return res.status(400).json({success: false, message : "Couldn't find vendor with that id"});
    });

  }}
  catch(error){
    console.error("Error while deleting new vendor:", error);
    return res.status(500).json({success : false, message: "Internal server error"});
  }
})

