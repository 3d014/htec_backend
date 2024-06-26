import express, { Response, Request, Router } from "express";
import { Vendor } from "../../models/Vendor";
import { protectedRoute } from "../../middleware/auth-middleware";
import { Invoice } from "../../models/Invoice";
import { v4 as uuidv4 } from "uuid";

export const vendorRouter: Router = express.Router();

vendorRouter.get("/", protectedRoute, async (req: Request, res: Response) => {
    const { vendorId } = req.body;
    let vendors;
    try{
      if (!vendorId) {
        vendors = await Vendor.findAll();

      } else {
        vendors = await Vendor.findAll({
          where: {
            vendorId: req.body.vendorId,
          },
        });
      }
      vendors.forEach((vendor: any) => {
          vendor.vendorTransactionNumber = vendor.vendorTransactionNumber.split(',').map((number: string) => number.trim());
      });

      vendors.forEach((vendor: any) => {
          vendor.vendorTelephone = vendor.vendorTelephone.split(',').map((number: string) => number.trim());
      });
      vendors.forEach((vendor: any) => {
          vendor.vendorEmail = vendor.vendorEmail.split(',').map((email: string) => email.trim());
      });
    
      return res.status(200).json(vendors);
    }catch(error){
      console.error(error)
      return res.status(500).json({message:"Internal server error"})

    }
  });

  

  vendorRouter.post("/", protectedRoute, async (req: Request, res: Response) => {
    const { vendorName, vendorAddress, vendorIdentificationNumber,vendorPDVNumber, vendorCity, vendorTelephone, vendorEmail, vendorTransactionNumber,supportsAvans } = req.body;

    try {
          const exists = await Vendor.findOne({
            where :{ vendorName }
        })
        if(!exists){
          const formattedTelephone = vendorTelephone?.join(',')||'';
          const formattedEmail = vendorEmail?.join(',')||'';
          const formattedTransactionNumber = vendorTransactionNumber?.join(',')||'';
          const vendorId=uuidv4()
          const newVendor = await Vendor.create({
            vendorId,
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

        }else{
          return res.status(409).json({success:false, message:"This vendor already exists"})

        }
        
    } catch (error) {
        console.error("Error creating new vendor:", error);
        return res.status(500).json({success: false, message: "Internal server error" });
    }
});


vendorRouter.delete('/', protectedRoute, async (req:Request, res: Response) =>{
  const {vendorId} = req.body;

  try{
    const vendorUsed = await Invoice.findOne({
      where: {vendorId}
    })

    if(vendorUsed){
      return res.status(409).json({success:false, message:"Vendor couldn't be deleted because it is already used in invoice"})

    }

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
    console.error(error);
    return res.status(500).json({success : false, message: "Internal server error"});
  }
})

vendorRouter.put('/', protectedRoute, async (req: Request, res: Response) => {
  const { vendorId, vendorName, vendorAddress, vendorIdentificationNumber, vendorPDVNumber, vendorCity, vendorTelephone, vendorEmail, vendorTransactionNumber, supportsAvans } = req.body;

  try {
    const vendor = await Vendor.findOne({
      where: { vendorId }
    });

    if (vendor) {
      const formattedTelephone = vendorTelephone?.join(',') || '';
      const formattedEmail = vendorEmail?.join(',') || '';
      const formattedTransactionNumber = vendorTransactionNumber?.join(',') || '';

      await vendor.update({
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

      return res.status(200).json({ success: true, message: "Vendor updated successfully" });
    } else {
      return res.status(404).json({ success: false, message: "Vendor not found" });
    }
  } catch (error) {
    console.error("Error updating vendor:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});
