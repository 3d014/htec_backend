import express, { Response, Request, Router } from "express";
import { Budget } from "../../models/Budget";
import { protectedRoute } from "../../middleware/auth-middleware";
import { Model, Op } from "sequelize";

export const budgetRouter=express.Router();


budgetRouter.get('/', protectedRoute, async (req : Request, res : Response) =>{
    const {budgetId} = req.body;

    try{
        if(!budgetId){
            let budget = await Budget.findAll();
    
        }else{
            let budget = await Budget.findAll({
                where:{
                    budgetId : req.body.budgetId,
                }
            }).then(()=>{
                res.status(200).json(budget);
    
            }).catch(() => {
                res.status(400).json({success:false, message:"Budget not found"});
    
            })
        };

    }catch(error){
        console.error("Error while trying to get budget", error);
        return res.status(500).json({success:false, message: "Internal server error"});

    }


})



// Uraditi kreiranje i brisanje budzeta

