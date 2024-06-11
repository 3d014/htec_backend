import express, { Response, Request, Router } from "express";
import { Invoice } from "../../models/Invoice";
import { InvoiceItem } from "../../models/InvoiceItem";
import { protectedRoute } from "../../middleware/auth-middleware";
import { v4 } from 'uuid';


export const invoiceRouter: Router = express.Router();
invoiceRouter.get("/", protectedRoute, async (req: Request, res: Response) => {
    const { invoiceId } = req.body;
    let invoices;
    try{
        if (!invoiceId) {
        invoices = await Invoice.findAll();
        } else {
        invoices = await Invoice.findAll({
            where: {
            invoiceId
            },
        });
        }
    
        return res.status(200).json(invoices);
    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});

    }
  });



invoiceRouter.delete("/", protectedRoute, (req: Request, res: Response) => {
    const { invoiceId } = req.body;
    try{
        if (invoiceId) {
        Invoice.destroy({
            where: {
            invoiceId: req.body.invoiceId,
            },
        })
            .then(() => {
            return res
                .status(200)
                .json({ success: true, msg: "Invoice successfully deleted" });
            })
            .catch(() => {
            return res
                .status(400)
                .json({ success: false, msg: "Invoice doesn't exist" });
            });
        }
    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
  });

  invoiceRouter.get("/invoiceItems", protectedRoute, async (req: Request, res: Response) => {
    const { invoiceId } = req.query;
    try {
        if (invoiceId) {
            const invoiceItems = await InvoiceItem.findAll({
                where: { invoiceId }
            });
            return res.status(200).json(invoiceItems);
        }
        return res.status(400).json({ message: "Invoice ID not provided" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
  


invoiceRouter.post("/",protectedRoute, async (req: Request, res: Response) => {
      const { vendorId, dateOfIssue,dateOfPayment, totalValueWithoutPdv, totalValueWithPdv, pdvValue, invoiceItems,invoiceId } = req.body;
      try{
        
        await Invoice.create({
            invoiceId,
            vendorId,
            dateOfIssue,
            dateOfPayment,
            totalValueWithoutPdv:totalValueWithoutPdv,
            totalValueWithPdv:totalValueWithPdv,
            pdvValue
            });
        
            for (const item of invoiceItems) {
                await InvoiceItem.create({
                    invoiceId,
                    ...item,
                    
                })             
            }
    
        return res.status(200).json({success:true, message : "Invoice successfully created"});
    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
  
    }
    
  );