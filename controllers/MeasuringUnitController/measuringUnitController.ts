import express, { Response, Request, Router } from "express";

import { MeasuringUnit } from "../../models/MeasuringUnit";
import { protectedRoute } from "../../middleware/auth-middleware";
import { v4 as uuidv4 } from "uuid";
import { Product } from "../../models/Product";

export const measuringUnitRouter=express.Router();

measuringUnitRouter.get("/",protectedRoute,async (req:Request,res:Response)=>{
    const {measuringUnitId}= req.body;
    let measuringUnit;
    try{
        if(!measuringUnit){
            measuringUnit=await MeasuringUnit.findAll()
        } else {
            measuringUnit =await MeasuringUnit.findAll({
                where:{
                    measuringUnitId:req.body.measuringUnitId
                }
            })
        }
        return res.status(200).json(measuringUnit);


    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }

 
})

measuringUnitRouter.post("/",protectedRoute,async(req:Request,res:Response)=>{
    const {abbreviation,measuringUnitName}=req.body;
    
    const measuringUnitId=uuidv4()
    try {
        const exists = await MeasuringUnit.findOne({
            where :{ measuringUnitName : req.body.measuringUnitName.toLowerCase()}
        })

        if(!exists){
            await MeasuringUnit.create({
                measuringUnitId,abbreviation,measuringUnitName
            })
            return res.status(200).json({success:true, message:"Measuring unit added successfully"});
        }else{

            return res.status(409).json({success:false, message:"This measuring unit already exists"})

        } 
    }catch (error){
            console.error(error)
            return res.status(500).json({message:"Internal server error"})
        }
        
        
    }
)



measuringUnitRouter.delete('/', protectedRoute, async(req: Request , res: Response) =>{
    const {measuringUnitId} = req.body;
    const alreadyInUse = await Product.findAll({
        where: {measuringUnitId : req.body.measuringUnitId}
    })
    
    try{
        if(!alreadyInUse){
            await MeasuringUnit.destroy({
                where: {
                    measuringUnitId : req.body.measuringUnitId,
                }
            })
            .then(() => {
                return res
                  .status(200)
                  .json({ success: true, msg: "Measuring unit successfully deleted" });
              })
              .catch(() => {
                return res
                  .status(400)
                  .json({ success: false, msg: "Measuring unit doesn't exist" });
              });


        }else{
            return res.status(409).json({success:false, message: "This measuring unit is already being used in a product"})
        }
        

    }catch(error){

        console.error(error);
        return res.status(500).json({success: false, message: "Internal server error"});

    }
    
})