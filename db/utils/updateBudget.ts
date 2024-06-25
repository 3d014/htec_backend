import dayjs from "dayjs"
import { InvoiceInstance, InvoiceItemInstance } from "../../interfaces/Invoice"
import ProductInstance from "../../interfaces/Product"
import { Budget } from "../../models/Budget"
import { Invoice } from "../../models/Invoice"
import { InvoiceItem } from "../../models/InvoiceItem"
import { Product } from "../../models/Product"
import { v4 as uuidv4 } from "uuid";
import { Category } from "../../models/Category"
import CategoryInstance from "../../interfaces/Category"
import { CategoryBudget } from "../../models/Category-Budget"
import BudgetInstance from "../../interfaces/Budget"
import CategoryBudgetInstance from "../../interfaces/CategoryBudget"

export const createNewBudget=async(dateOfIssue:unknown,totalValueWithPdv:unknown)=>{
  
   try{

        let budgetId=uuidv4()
        await Budget.create({
            budgetId:budgetId,
            totalBudget:0,
            spentBudget:totalValueWithPdv,
            year:dayjs(dateOfIssue as Date).format('YYYY'),
            month:dayjs(dateOfIssue as Date).format('MMMM')
        })
        
        let categories= await Category.findAll() as unknown as CategoryInstance[]
        await CategoryBudget.bulkCreate(categories.map(category=>{return {
            categoryBudgetId:uuidv4(),
            budgetId:budgetId,
            categoryId:category.categoryId,
            percentage:0
        }}))
        
    } catch{}
        
    }

    const updateCategoryPercentages = async (
        budget: BudgetInstance,
        products: ProductInstance[],
        invoiceItems: InvoiceItemInstance[],
        chosenInvoices: InvoiceInstance[]
      ) => {
        try {
          let categories=await Category.findAll() as unknown as CategoryInstance[]
          let categorySum: { [key: number]: number } = {};

          categories.forEach(category=>categorySum[category.categoryId]=0)

          let chosenInvoicesIds = chosenInvoices.map(invoice => invoice.invoiceId);
      
          // Calculate sums for each category based on invoice items
          invoiceItems.forEach(item => {
            if (chosenInvoicesIds.includes(item.invoiceId)) {
              const product = products.find(product => item.productId === product.productId);
              const categoryId = product?.categoryId;
              if (categoryId) {
                
                categorySum[categoryId] += parseFloat(item.sumWithPdv.toString());
              }
            }
          });
      

          categories.forEach(async(category)=>{
            const sum=categorySum[category.categoryId]
            let percentage=0
            if(budget.spentBudget!==0){
                percentage=(sum/budget.spentBudget)*100
            }
            await CategoryBudget.update({percentage:percentage},{where:{categoryId:category.categoryId,budgetId:budget.budgetId}})
          })
         
      
        } catch (error) {
          console.error("Error updating category percentages:", error);
        }
      };

const updateBudget=async (dateOfIssue:unknown)=>{
    try{
    const invoices=await Invoice.findAll() as unknown as InvoiceInstance[]
    
    const invoiceItems=await InvoiceItem.findAll() as unknown as InvoiceItemInstance[]
    const products=await Product.findAll() as unknown as ProductInstance[]
    
    let month=dayjs(dateOfIssue as Date).format('MMMM')
    let year=dayjs(dateOfIssue as Date).format('YYYY')
    
    let budget=await Budget.findOne({where:{
        month:month,
        year:year
    }}) as unknown as BudgetInstance
   
        
    

    let chosenInvoices=invoices.filter((invoice)=>{
        if(dayjs(invoice.dateOfIssue).format('MMMM')===month && dayjs(invoice.dateOfIssue).format('YYYY')===year){
            return invoice
        }
    })

    if(chosenInvoices.length>0) {
      
        let totalSpent = 0;
      for (let invoice of chosenInvoices) {
        totalSpent += parseFloat(invoice.totalValueWithPdv as unknown as string);
      }
        
        await Budget.update({
            spentBudget:totalSpent
        },{where:{
            year:year,
            month:month
        }})
        
    }
    budget=await Budget.findOne({where:{
        month:dayjs(dateOfIssue as Date).format('MMMM'),
        year:dayjs(dateOfIssue as Date).format('YYYY')
    }}) as unknown as BudgetInstance
    
    await updateCategoryPercentages(budget,products,invoiceItems,chosenInvoices)
    

    
        
   
    }catch(err){
        console.log(err)
    }




}

export default updateBudget