import express, { Response, Request, Router, response } from "express";
import { Invoice } from "../../models/Invoice";
import { InvoiceItem } from "../../models/InvoiceItem";
import { protectedRoute } from "../../middleware/auth-middleware";
import { Product } from "../../models/Product";
import ProductInstance from "../../interfaces/Product";
import { InvoiceInstance, InvoiceItemInstance } from "../../interfaces/Invoice";
import calculateBudget from "../../db/utils/calculateBudget";
import updateBudget from "../../db/utils/updateBudget";
import multer from 'multer'



const upload=multer()


export const invoiceRouter: Router = express.Router();



invoiceRouter.get("/", protectedRoute, async (req: Request, res: Response) => {
    const { invoiceId } = req.body;
    let invoices;
    try{
        if (!invoiceId) {
        invoices = await Invoice.findAll();
        } else {
        invoices = await Invoice.findOne({
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



invoiceRouter.get("/invoiceItems", protectedRoute, async (req: Request, res: Response) => {
    const { invoiceId } = req.query;
    try {
        if (invoiceId) {
            const invoiceItems = await InvoiceItem.findAll({
                where: { invoiceId }
            });
            return res.status(200).json(invoiceItems);
        }
        return res.status(400).json({ message: "Invoice ID is not provided" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
  


invoiceRouter.get("/invoice/productSum",async(req:Request,res:Response)=>{
     try {
        const invoiceItems = await InvoiceItem.findAll() as unknown as InvoiceItemInstance[];
        const invoices = await Invoice.findAll() as unknown as InvoiceInstance[];
        const products= await Product.findAll() as unknown as ProductInstance[]
        const productSumMap: { [key: string]: { productName: string, productSum: number } } = {};

        invoiceItems.forEach(item => {
        if (invoices.some(invoice => invoice.invoiceId == item.invoiceId)) {
            const product = products.find(p => p.productId === item.productId);
            if (product) {
                const sumWithPdv = parseFloat(item.sumWithPdv.toString())
            if (!productSumMap[item.productId]) {
                productSumMap[item.productId] = {
                productName: product.productName,
                productSum: 0
                };
            }
            productSumMap[item.productId].productSum += sumWithPdv
            }
        }
        });

        return res.status(200).json(productSumMap);

    } catch (error) {
        console.error("Error fetching invoice data:", error);
        return res.status(500).json({ error: "An error occurred while fetching invoice data." });
    }
});



invoiceRouter.post('/uploadInvoice',protectedRoute,upload.single('file'),async(req:Request,res:Response)=>{
    try{
        const {formData}=req.body
    console.log(req.body)
    console.log(req.file)
    return res.status(200).json({ message: 'File uploaded successfully' });
    } catch (error){
        console.error('Error handling file upload:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


  
invoiceRouter.post("/",protectedRoute, async (req: Request, res: Response) => {
      const { vendorId, dateOfIssue,dateOfPayment, totalValueWithoutPdv,invoiceNumber, totalValueWithPdv, pdvValue, invoiceItems,invoiceId } = req.body;
      try{
        await Invoice.create({
            invoiceId,
            vendorId,
            invoiceNumber,
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
        calculateBudget(dateOfIssue,totalValueWithPdv)
        return res.status(200).json({success:true, message : "Invoice successfully created"});
    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
});


invoiceRouter.delete("/", protectedRoute,async (req: Request, res: Response) => {
    const { invoiceId } = req.body;
    try{
        if (invoiceId){
            const invoice = await Invoice.findByPk(invoiceId);
            const dateOfIssue = invoice?.dataValues.dateOfIssue;
            const totalValueWithPdv = invoice?.dataValues.totalValueWithPdv;
            updateBudget(invoiceId,dateOfIssue,totalValueWithPdv);

            await InvoiceItem.destroy({
                where:{invoiceId}
            });
                
            await Invoice.destroy({
                where: {invoiceId}
            })    
            return res.status(200).json({ success: true, message: "Invoice deleted successfully" });
            
        }else{
            return res.status(400).json({ success: false, message: "Invoice doesn't exist" });
        }   
    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
  });


  
