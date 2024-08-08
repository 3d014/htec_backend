import express, { Response, Request, Router } from "express";
import { Budget } from "../../models/Budget";
import { protectedRoute } from "../../middleware/auth-middleware";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { CategoryBudget } from "../../models/Category-Budget";
import { Category } from "../../models/Category";
import CategoryInstance from "../../interfaces/Category";
import RequestBody from "../../interfaces/Budget";


export const budgetRouter = express.Router();



budgetRouter.get('/:year/:month', protectedRoute, async (req: Request, res: Response) => {
  const { year, month } = req.params;
  
  try {
      const budget = await Budget.findOne({
          where: {
              year,
              month
          }
      });

      if (!budget) {
          return res.status(404).json({ success: false, message: "Budget not found" });
      }

      return res.status(200).json({ success: true, budget });
  } catch (error) {
      console.error("Error while trying to fetch budget", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
  }
});



budgetRouter.get('/', protectedRoute, async (req: Request, res: Response) => {
  try {
   
    let newBudgetCreated = false;
    const currentBudgetExists = await Budget.findOne(
        {
            where:{
                month:dayjs().format('MMMM'),
                year:dayjs().format('YYYY')
            }
        }
    )
    if(!currentBudgetExists){
        let budgetId=uuidv4()
        await Budget.create({
            budgetId,
            totalBudget:0,
            spentBudget:0,
            year:dayjs().format('YYYY'),
            month:dayjs().format('MMMM')
        })
        newBudgetCreated = true;
        let categories= await Category.findAll() as unknown as CategoryInstance[]
        await CategoryBudget.bulkCreate(categories.map(category=>{return {
            categoryBudgetId:uuidv4(),
            budgetId:budgetId,
            categoryId:category.categoryId,
            totalValue: 0,
            spentValue : 0
        }}))

    }



    const budgets = await Budget.findAll();
    return res.status(200).json({budgets,newBudgetCreated});

    } 
   catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});



budgetRouter.post('/', protectedRoute, async (req: Request, res: Response) => {
    try {
      const {budgetData,month,year } : RequestBody = req.body;
      const budget=await Budget.findOne({
          where:{month:month,year:year}
        })
        
      if (!budget){
        const budgetId = uuidv4();
        let totalBudget = 0;
        for (const [categoryId, totalValue] of Object.entries(budgetData)) {
          totalBudget += totalValue;
          const categoryBudgetId = uuidv4();
          const newCategoryBudget = await CategoryBudget.create({
              categoryBudgetId,
              categoryId,
              budgetId,
              totalValue,
              spentValue:0
          })
        }
        const newBudget = await Budget.create({
          budgetId, 
          totalBudget,
          spentBudget:0,
          month,
          year
        });
        
    
        return res.status(200).json({success:true, message: "Budget for selected month has been added successfully"});
    }else{
        const budgetId = budget.dataValues.budgetId;
        let totalBudget = 0;
        for (const [categoryId, totalValue] of Object.entries(budgetData)) {
          totalBudget += totalValue;
          const categoryBudgetId = uuidv4();
          await CategoryBudget.update(
            {totalValue:totalValue},
            {where:{budgetId,categoryId}}
          )
        }
        await budget.update(
            {
                totalBudget : totalBudget,
            
            }
        )
        
        return res.status(409).json({success:true, message:"Existing budget value has been updated"});
    }}catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
});



  budgetRouter.delete('/:budgetId', protectedRoute, async (req: Request, res: Response) => {
    try {
      const { budgetId } = req.params;
  
      if (!budgetId) {
        return res.status(400).json({ success: false, message: "Budget id parameter is missing" });
      }
  
      const budgetDeleted = await Budget.destroy({
        where: {
          budgetId
        }
      }) && await CategoryBudget.destroy({
        where:{
            budgetId
        }
      })

  
      if (!budgetDeleted) {
        return res.status(404).json({ success: false, message: "There was a problem while deleting a budget" });
      }
  
      return res.status(200).json({ success: true, message: "Budget deleted successfully" });
    } catch (error) {
      console.error("Error while trying to delete budget", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
});
  
  

  budgetRouter.put('/:month/:year', protectedRoute, async (req: Request, res: Response) => {
    try {
      const { month, year } = req.params;
      const { budgetData } : RequestBody = req.body;

      let totalBudget = 0;
      for (const [categoryId, totalValue] of Object.entries(budgetData)) {
        totalBudget += totalValue;

        await CategoryBudget.update(
            {
                totalValue:totalValue
            },
            {
                where: {categoryId: categoryId}
            }
        )

      };

      const budgetUpdated = await Budget.update(
        {
            totalBudget:totalBudget
        },
        {
            where: { month: month, year: year }
        }) 

      if(!budgetUpdated){
        return res.status(400).json({ success: true, message: "There was a problem while updating a budget" });

      }

      return res.status(200).json({ success: true, message: "Budget updated successfully" });

      
    }
      catch(error){
      console.error(error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
});


  





  