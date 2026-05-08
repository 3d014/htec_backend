import express, { Response, Request, Router } from "express";
import { Category } from "../../models/Category";
import { protectedRoute } from "../../middleware/auth-middleware";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";


export const categoriesRouter=express.Router();



categoriesRouter.get("/", protectedRoute, async (req: Request, res: Response) => {
    const { categoryId } = req.body;
    const { search = '', page = '1', limit = '10' } = req.query as Record<string, string>;

    try {
        if (categoryId) {
            const category = await Category.findOne({ where: { categoryId } });
            return res.status(200).json(category);
        }

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const offset = (pageNum - 1) * limitNum;
        const where = search ? { categoryName: { [Op.like]: `%${search}%` } } : {};

        const { count, rows } = await Category.findAndCountAll({
            where,
            limit: limitNum,
            offset,
            order: [['categoryName', 'ASC']],
        });

        return res.status(200).json({ data: rows, total: count, page: pageNum, limit: limitNum });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});



categoriesRouter.post("/",protectedRoute,async(req:Request,res:Response)=>{
    const {categoryName}=req.body;
    const categoryId=uuidv4()

    try {
        const exists = await Category.findOne({
            where :{ categoryName }
        })

        if(!exists){
            await Category.create({
                categoryId,
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
});



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
});



categoriesRouter.delete('/', protectedRoute, async(req: Request , res: Response) =>{
    const {categoryId} = req.body;
    
    try{
        if(categoryId){
            await Category.destroy({
                where: {categoryId}
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
});