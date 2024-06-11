import express, { Response, Request, Router } from "express";

import { Category } from "../../models/Category";
import { protectedRoute } from "../../middleware/auth-middleware";
import { Op } from "sequelize";

export const categoriesRouter=express.Router();

categoriesRouter.get("/",protectedRoute,async (req:Request,res:Response)=>{
    const {categoryId}=req.body;
    let categories;
    try{
        if(!categoryId){
            categories=await Category.findAll()
        } else {
            categories=await Category.findAll({
                where:{
                    categoryId:req.body.categoryId
                }
            })
        }
        return res.status(200).json(categories);


    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }

 
})

categoriesRouter.post("/",protectedRoute,async(req:Request,res:Response)=>{
    const {categoryName}=req.body;

    
    try {
        const exists = await Category.findOne({
            where :{ categoryName }
        })

        if(!exists){
            await Category.create({
                categoryName
            })
            return res.status(200).json({success:true, message:"Category created successfully"});
        }else{

            return res.status(409).json({success:false, message:"This category already exists"})

        } 
    }catch (error){
            console.error(error)
            return res.status(500).json({message:"Internal server error"})
        }
        
        
    }
)
categoriesRouter.put("/", protectedRoute, async (req: Request, res: Response) => {
    const { categoryId, categoryName } = req.body;
    try {
       const category = await Category.findOne({
        where: {categoryId}
       })
       category?.update({
        categoryName: categoryName
       })
       category?.save()
    } catch(error){
      console.log(error)
    }
    return res.status(200).end();
  }
);

categoriesRouter.delete('/', protectedRoute, async(req: Request , res: Response) =>{
    const {categoryId} = req.body;
    
    try{
        if(categoryId){
            await Category.destroy({
                where: {
                    categoryId : req.body.categoryId,
                }
            })
            .then(() => {
                return res
                  .status(200)
                  .json({ success: true, msg: "Category successfully deleted" });
              })
              .catch(() => {
                return res
                  .status(400)
                  .json({ success: false, msg: "Category doesn't exist" });
              });


        }

    }catch(error){

        console.error(error);
        return res.status(500).json({success: false, message: "Internal server error"});

    }
    
})