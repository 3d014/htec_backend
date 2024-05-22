import express, { Response, Request, Router } from "express";
import { Vendor } from "../../models/Vendor";
import { protectedRoute } from "../../middleware/auth-middleware";
import { Op } from "sequelize";


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
    const { vendorName, vendorAddress, vendorIdentificationNumber,vendorPDVNumber, vendorCity, vendorTelephoneNumber, vendorEmail, vendorTransactionNumber,supportsAvans } = req.body;

    try {
          const exists = await Vendor.findOne({
            where :{ vendorName }
        })
        if(!exists){
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

