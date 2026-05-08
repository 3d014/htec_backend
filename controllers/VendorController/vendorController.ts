import express, { Response, Request, Router } from "express";
import { Vendor } from "../../models/Vendor";
import { protectedRoute } from "../../middleware/auth-middleware";
import { Invoice } from "../../models/Invoice";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";


export const vendorRouter: Router = express.Router();



const parseVendorArrayFields = (vendors: any[]) => {
  vendors.forEach((vendor: any) => {
    vendor.vendorTransactionNumber = vendor.vendorTransactionNumber.split(',').map((s: string) => s.trim());
    vendor.vendorTelephone = vendor.vendorTelephone.split(',').map((s: string) => s.trim());
    vendor.vendorEmail = vendor.vendorEmail.split(',').map((s: string) => s.trim());
  });
};

vendorRouter.get("/", protectedRoute, async (req: Request, res: Response) => {
    const { vendorId } = req.body;
    const { search = '', page = '1', limit = '10' } = req.query as Record<string, string>;

    try {
      if (vendorId) {
        const vendor = await Vendor.findOne({ where: { vendorId } });
        if (vendor) parseVendorArrayFields([vendor]);
        return res.status(200).json(vendor);
      }

      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
      const offset = (pageNum - 1) * limitNum;
      const where = search ? { vendorName: { [Op.like]: `%${search}%` } } : {};

      const { count, rows } = await Vendor.findAndCountAll({
        where,
        limit: limitNum,
        offset,
        order: [['vendorName', 'ASC']],
      });

      parseVendorArrayFields(rows as any[]);
      return res.status(200).json({ data: rows, total: count, page: pageNum, limit: limitNum });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
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
      await Vendor.destroy({where:{vendorId} })
    .then(() => {
      return res.status(200).json({sucess: true, message: "Vendor deleted successfully"});
    })
    .catch(() => {
      return res.status(400).json({success: false, message : "Vendor with that ID doesn't exist"});
    });

  }}
  catch(error){
    console.error(error);
    return res.status(500).json({success : false, message: "Internal server error"});
  }
});



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
