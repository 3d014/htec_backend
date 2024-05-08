import express, { Response, Request, Router } from "express";

import { Categories } from "../../models/Category";
import { protectedRoute } from "../../middleware/auth-middleware";
import { Op } from "sequelize";

export const categoriesRouter=express.Router();

categoriesRouter.get("/",protectedRoute,async (req:Request,res:Response)=>{
    const {categoryId}=req.body;
    let categories;
    if(!categoryId){
        categories=await Categories.findAll()
    } else {
        categories=await Categories.findAll({
            where:{
                categoryId:{[Op.startsWith]:categoryId}
            }
        })
    }

    return res.send(categories)
 
})

categoriesRouter.post("/",protectedRoute,async(req:Request,res:Response)=>{
    const {categoryName}=req.body;
    
    try {
        const newCategory=await Categories.create({
            categoryName
        })
        return res.status(201).json(newCategory);
    } catch (error){
        console.log("Error creating new category:",error)
        return res.status(500).json({message:"Internal server error"})
    }
})