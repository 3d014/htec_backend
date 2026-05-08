import express, { Response, Request, Router, response } from "express";
import { Invoice } from "../../models/Invoice";
import { InvoiceItem } from "../../models/InvoiceItem";
import { protectedRoute } from "../../middleware/auth-middleware";
import { Product } from "../../models/Product";
import { Vendor } from "../../models/Vendor";
import ProductInstance from "../../interfaces/Product";
import { InvoiceInstance, InvoiceItemInstance } from "../../interfaces/Invoice";
import calculateBudget from "../../db/utils/calculateBudget";
import updateBudget from "../../db/utils/updateBudget";
import multer from 'multer'
import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from "uuid";

const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

const anthropicClient = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
});


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


invoiceRouter.post('/scan-invoice', protectedRoute, upload.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file provided' });
        }

        const { mimetype, buffer } = req.file;
        const isPdf = mimetype === 'application/pdf';
        const isImage = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(mimetype);

        if (!isPdf && !isImage) {
            return res.status(400).json({ message: 'Unsupported file type. Use PDF or image.' });
        }

        const prompt = `You are an invoice data extractor. Analyze this invoice document and extract the following information as a JSON object.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "invoiceNumber": "string or null",
  "vendorName": "string or null",
  "dateOfIssue": "YYYY-MM-DD or null",
  "dateOfPayment": "YYYY-MM-DD or null",
  "items": [
    {
      "productName": "string",
      "productCode": "string or null",
      "quantity": number,
      "priceWithoutPdv": number or null,
      "discount": number or null
    }
  ]
}

Rules:
- dateOfIssue and dateOfPayment must be in YYYY-MM-DD format
- priceWithoutPdv should be the unit price excluding VAT/PDV
- discount should be a percentage (0-100), null if not present
- quantity must be a positive number
- Return empty array for items if none found`;

        const contentBlock: any = isPdf
            ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: buffer.toString('base64') } }
            : { type: 'image', source: { type: 'base64', media_type: mimetype as any, data: buffer.toString('base64') } };

        const response = await anthropicClient.messages.create({
            model: process.env.ANTHROPIC_MODEL || 'claude-haiku-4-5-20251001',
            max_tokens: 2048,
            messages: [
                {
                    role: 'user',
                    content: [contentBlock, { type: 'text', text: prompt }],
                },
            ],
        });

        const rawText = (response.content[0] as any)?.text ?? '';

        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return res.status(422).json({ message: 'Could not extract structured data from invoice', raw: rawText });
        }

        const extracted = JSON.parse(jsonMatch[0]);
        return res.status(200).json({ success: true, data: extracted });

    } catch (error: any) {
        console.error('Error scanning invoice:', error);
        return res.status(500).json({ message: 'Internal server error', detail: error.message });
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


invoiceRouter.post("/submit-scanned", protectedRoute, async (req: Request, res: Response) => {
    const { vendor, invoice, items } = req.body;

    if (!vendor?.vendorName || !invoice?.invoiceNumber || !items?.length) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        // findOrCreate vendor by name
        let existingVendor = await Vendor.findOne({ where: { vendorName: vendor.vendorName } });
        if (!existingVendor) {
            const vendorId = uuidv4();
            existingVendor = await Vendor.create({
                vendorId,
                vendorName: vendor.vendorName,
                vendorAddress: vendor.vendorAddress || '',
                vendorIdentificationNumber: vendor.vendorIdentificationNumber || '',
                vendorPDVNumber: vendor.vendorPDVNumber || '',
                vendorCity: vendor.vendorCity || '',
                vendorTelephone: Array.isArray(vendor.vendorTelephone) ? vendor.vendorTelephone.join(',') : (vendor.vendorTelephone || ''),
                vendorEmail: Array.isArray(vendor.vendorEmail) ? vendor.vendorEmail.join(',') : (vendor.vendorEmail || ''),
                vendorTransactionNumber: Array.isArray(vendor.vendorTransactionNumber) ? vendor.vendorTransactionNumber.join(',') : (vendor.vendorTransactionNumber || ''),
                supportsAvans: vendor.supportsAvans || false,
            });
        }

        const vendorId = (existingVendor as any).vendorId;
        const invoiceId = uuidv4();

        // findOrCreate each product, collect resolved items
        const resolvedItems = [];
        for (const item of items) {
            let product = await Product.findOne({ where: { productName: item.productName } });
            if (!product) {
                const productId = uuidv4();
                product = await Product.create({
                    productId,
                    productName: item.productName,
                    measuringUnit: item.measuringUnit || 'kom',
                    categoryId: item.categoryId || null,
                    description: item.description || '',
                });
            }
            resolvedItems.push({
                invoiceItemId: uuidv4(),
                productId: (product as any).productId,
                productCode: item.productCode || '',
                quantity: item.quantity,
                priceWithoutPdv: item.priceWithoutPdv,
                discount: item.discount || 0,
                sumWithPdv: item.sumWithPdv,
            });
        }

        await Invoice.create({
            invoiceId,
            vendorId,
            invoiceNumber: invoice.invoiceNumber,
            dateOfIssue: invoice.dateOfIssue,
            dateOfPayment: invoice.dateOfPayment,
            totalValueWithoutPdv: invoice.totalValueWithoutPdv,
            totalValueWithPdv: invoice.totalValueWithPdv,
            pdvValue: invoice.pdvValue,
        });

        for (const item of resolvedItems) {
            await InvoiceItem.create({ invoiceId, ...item });
        }

        calculateBudget(invoice.dateOfIssue, invoice.totalValueWithPdv);

        return res.status(200).json({ success: true, message: "Invoice created successfully", invoiceId });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
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


  
