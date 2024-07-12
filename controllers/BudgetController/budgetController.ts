import express, { Response, Request, Router } from "express";
import { Budget } from "../../models/Budget";
import { protectedRoute } from "../../middleware/auth-middleware";
import { Op } from "sequelize";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { CategoryBudget } from "../../models/Category-Budget";
import { Category } from "../../models/Category";
import CategoryInstance from "../../interfaces/Category";
import BudgetInstance from "../../interfaces/Budget";



export const budgetRouter = express.Router();


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
            budgetId:budgetId,
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
            percentage:0
        }}))

    }



    const budgets = await Budget.findAll();

    res.status(200).json({budgets,newBudgetCreated});
    } 
   catch (error) {
    console.error("Error while trying to get budgets", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// POST route to create a new budget
budgetRouter.post('/', protectedRoute, async (req: Request, res: Response) => {
  try {
    const { budgetId,spentBudget, totalBudget, month, year } = req.body;

   const budget=await Budget.findAll({
    where:{month:month,year:year}
   })

   if (budget){return res.status(252)}
    // Create new budget
    const newBudget = await Budget.create({
      budgetId, // Assuming you generate a unique UUID for budgetId
      spentBudget,
      totalBudget,
      month,
      year
    });

    return res.status(500)
  } catch (error) {
    console.error("Error while trying to create budget", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// DELETE route to delete a budget
budgetRouter.delete('/:budgetId', protectedRoute, async (req: Request, res: Response) => {
  try {
    const { budgetId } = req.params;

    // Validate budgetId
    if (!budgetId) {
      return res.status(400).json({ success: false, message: "Missing budgetId parameter" });
    }

    // Find budget by ID and delete
    const deletedBudgetCount = await Budget.destroy({
      where: {
        budgetId
      }
    });

    if (deletedBudgetCount === 0) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    return res.status(200).json({ success: true, message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Error while trying to delete budget", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});
budgetRouter.put('/:year/:month', protectedRoute, async (req: Request, res: Response) => {
    try {
      const { year, month } = req.params;
      const { totalBudget, spentBudget } = req.body;
  
      let [budget, created] = await Budget.findOrCreate({
        where: { month: month, year: year },
        defaults: {
          budgetId: uuidv4(),
          totalBudget: totalBudget || 0,
          spentBudget: spentBudget || 0,
        }
      });
  
      if (!created) {
        await Budget.update(
          {
            totalBudget: totalBudget ,
            spentBudget: spentBudget ,
          },
          {
            where: { month: month, year: year }
          }
        );
  
        return res.status(200).json({ success: true, message: "Budget updated" });
      }
  
      const categories = await Category.findAll() as unknown as CategoryInstance[];
      const currentBudget=await Budget.findOne({where:{
        month:month,
        year:year
      }}) as unknown as BudgetInstance
      await CategoryBudget.bulkCreate(categories.map(category => {
    
        return {
          categoryBudgetId: uuidv4(),
          budgetId: currentBudget.budgetId,
          categoryId: category.categoryId,
          percentage: 0
        };
      }));
  
      return res.status(201).json({ success: true, message: "New budget created", budget });
    } catch (error) {
      console.error("Error while trying to update budget", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

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


export default budgetRouter;
