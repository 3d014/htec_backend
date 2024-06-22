import express, { Response, Request, Router } from "express";
import { Invoice } from "../../models/Invoice";
import { InvoiceItem } from "../../models/InvoiceItem";
import { protectedRoute } from "../../middleware/auth-middleware";
import { Product } from "../../models/Product";

interface ProductSum{
    productId:number,
    productName:string,
    productSum:number

}

interface InvoiceInterface {
    invoiceId: string;
    vendorId: number;
    invoiceNumber: string;
    dateOfIssue: Date;
    dateOfPayment: Date;
    totalValueWithoutPdv: number;
    totalValueWithPdv: number;
    pdvValue: number;
  }

  interface InvoiceItemInterface {
    invoiceItemId: string;
    invoiceId: string;
    quantity: number;
    priceWithoutPdv: number;
    priceWithPdv: number;
    sumWithoutPdv: number;
    sumWithPdv: number;
    discount: number;
    productId: number;
    productCode: string;
  }
  interface ProductInterface {
    productId: number;
    productName: string;
    measuringUnit: string;
    categoryId: number; // foreign key to Categories
  }
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
  
invoiceRouter.get("/invoice/productSum",async(req:Request,res:Response)=>{
     try {
        const invoiceItems = await InvoiceItem.findAll() as unknown as InvoiceItemInterface[];
        const invoices = await Invoice.findAll() as unknown as InvoiceInterface[];
        const products= await Product.findAll() as unknown as ProductInterface[]

        const productSumMap: { [key: number]: { productName: string, productSum: number } } = {};

    invoiceItems.forEach(item => {
      if (invoices.some(invoice => invoice.invoiceId == item.invoiceId)) {
        // Find the corresponding product
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
})
  

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
    
        return res.status(200).json({success:true, message : "Invoice successfully created"});
    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
  
    }
    
  );