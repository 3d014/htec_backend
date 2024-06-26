import dayjs from "dayjs"
import BudgetInstance from "../../interfaces/Budget"
import { Budget } from "../../models/Budget"
import { v4 as uuidv4 } from "uuid"
import { Category } from "../../models/Category"
import { CategoryBudget } from "../../models/Category-Budget"
import { Invoice } from "../../models/Invoice"
import { InvoiceItem } from "../../models/InvoiceItem"
import { Product } from "../../models/Product"

const calculateBudget=async (dateOfIssue:Date,totalValueFromInvoice:number)=>{
  
    
    const month=dayjs(dateOfIssue).format('MMMM')
    const year=dayjs(dateOfIssue).format('YYYY')
    let budget=await Budget.findOne({where:{month:month,year:year}}) 
    const categories=await Category.findAll()
    const categoriesIds=categories.map(category=>category.dataValues.categoryId)
    const invoices=await Invoice.findAll()
    const filteredInvoices=invoices.filter(invoice=>dayjs(invoice.dataValues.dateOfIssue).format('MMMM') === month && dayjs(invoice.dataValues.dateOfIssue).format('YYYY') === year)
    const invoiceItems=await InvoiceItem.findAll()
    const filteredInvoiceItems=invoiceItems.filter(item=>filteredInvoices.some(invoice=>invoice.dataValues.invoiceId==item.dataValues.invoiceId))
    
    const categorySum:{[categoryId:string]:number}={}
    categoriesIds.forEach(categoryId=>{categorySum[categoryId]=0})

    filteredInvoiceItems.forEach(async(invoiceItem)=>{
        let product=await Product.findOne({where:{productId:invoiceItem.dataValues.productId}})
        if(product){categorySum[product.dataValues.categoryId]=0+ Number(categorySum[product.dataValues.categoryId])+Number(invoiceItem.dataValues.sumWithPdv)}
    })
   
    if(!budget) {
        const budgetId=uuidv4()
        await Budget.create(
            {
                budgetId:budgetId,
                totalBudget:0,
                spentBudget:totalValueFromInvoice,
                month:month,
                year:year
            }
        )
        categoriesIds.forEach(async(categoryId)=>{
           let percentage=(categorySum[categoryId]/totalValueFromInvoice)*100
            await CategoryBudget.create({categoryId:categoryId,
                        budgetId:budgetId,
                        percentage:percentage,
                        categoryBudgetId:uuidv4()})
        })
    
}else {
    const currentSpentBudget = Number(budget.dataValues.spentBudget)
    await Budget.update({ spentBudget: totalValueFromInvoice + currentSpentBudget }, { where: { budgetId: budget.dataValues.budgetId } });

    const updatedBudget = await Budget.findOne({ where: { month, year } });
    if (updatedBudget) {
        for (const categoryId of categoriesIds) {
            const updatedPercentage = (categorySum[categoryId] / Number(updatedBudget.dataValues.spentBudget)) * 100;
            await CategoryBudget.update({ percentage: updatedPercentage }, { where: { categoryId, budgetId: budget.dataValues.budgetId } });
        }
    }
}

        

}

export default calculateBudget