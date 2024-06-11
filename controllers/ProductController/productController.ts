import express, { Response, Request, Router } from "express";
import { Product } from "../../models/Product";
import { protectedRoute } from "../../middleware/auth-middleware";
import { Op } from "sequelize";

export const productsRouter: Router = express.Router();
productsRouter.get("/", protectedRoute, async (req: Request, res: Response) => {
  const { productId } = req.body;
  let products;
  try{
    if (!productId) {
      products = await Product.findAll();
    } else {
      products = await Product.findAll({
        where: {
          productId: req.body.productId
        },
      });
    }

    return res.status(200).json(products);
  }catch(error){
      console.error(error);
      return res.status(500).json({message:"Internal server error"});

  }
});



productsRouter.delete("/", protectedRoute, async (req: Request, res: Response) => {
  const { productId } = req.body;
  try{
    if (productId) {
      await Product.destroy({
        where: {
          productId : req.body.productId,
        },
      })
        .then(() => {
          return res
            .status(200)
            .json({ success: true, message: "Product successfully deleted" });
        })
        .catch(() => {
          return res
            .status(400)
            .json({ success: false, message: "Product doesn't exist" });
        });
    }
  }catch(error){
      console.error(error);
      return res.status(500).json({message:"Internal server error"});
  }
});

productsRouter.post(
  "/",
  protectedRoute,
  async (req: Request, res: Response) => {
    const { productName, measuringUnit, categoryId} = req.body;
    try{
      const exists = await Product.findOne({
        where :{ productName }
      })
      if(!exists){
        await Product.create({
          productName,
          measuringUnit,
          categoryId,
          
        });
      }else{
        return res.status(409).json({success:false, message:"This product already exists"})

      }
    }catch(error){
      console.error(error);
      res.status(500).json({success:false, message: "Internal server error"});

    }
    
    
    return res.status(200).end();
  }
);

productsRouter.put("/", protectedRoute,
    async (req: Request, res: Response) => {
      const { productId, productName, measuringUnit, categoryId } = req.body;
      try {
         const prod = await Product.findOne({
          where: {productId}
         })
         prod?.set({
          productName: productName,
          measuringUnit: measuringUnit,
          categoryId: categoryId
         })
         prod?.save()
      } catch(error){
        console.log(error)
      }
      return res.status(200).end();
    }
 
  );