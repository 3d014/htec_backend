import express, { Response, Request, Router } from "express";

import { Category } from "../../models/Category";
import { protectedRoute } from "../../middleware/auth-middleware";
import { Op } from "sequelize";

export const categoriesRouter=express.Router();

categoriesRouter.get("/",protectedRoute,async (req:Request,res:Response)=>{
    const {categoryId}=req.body;
    let categories;
    if(!categoryId){
        categories=await Category.findAll()
    } else {
        categories=await Category.findAll({
            where:{
                categoryId:{[Op.startsWith]:categoryId}
            }
        })
    }

    return res.json(categories)
 
})

categoriesRouter.post("/",protectedRoute,async(req:Request,res:Response)=>{
    const {categoryName}=req.body;
    
    try {
        const newCategory=await Category.create({
            categoryName
        })
        return res.status(200).json({success:true, message:"Category created successfully"});
    } catch (error){
        console.log("Error creating new category:",error)
        return res.status(500).json({message:"Internal server error"})
    }
})

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

        console.error("Error deleting a category", error);
        return res.status(500).json({success: false, message: "Internal server error"});

    }
    
})