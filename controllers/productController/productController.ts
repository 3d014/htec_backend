import express, { Response, Request, Router } from "express";
import { Product } from "../../models/Product";
import { protectedRoute } from "../../middleware/auth-middleware";
import { Op } from "sequelize";

export const productsRouter: Router = express.Router();
productsRouter.get("/", protectedRoute, async (req: Request, res: Response) => {
  const { productId } = req.body;
  let products;
  if (!productId) {
    products = await Product.findAll();
  } else {
    products = await Product.findAll({
      where: {
        productId: req.body.productId
      },
    });
  }

  return res.send(products);
});

productsRouter.delete("/", protectedRoute, async (req: Request, res: Response) => {
  const { productId } = req.body;
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
});

productsRouter.post(
  "/",
  protectedRoute,
  async (req: Request, res: Response) => {
    const { productName, measuringUnit, categoryId, description} = req.body;
    try{
      const product = await Product.create({
        productName,
        measuringUnit,
        categoryId,
        description
      });
      product.save();

    }catch(error){
      console.error("Error while creating product", error);
      res.status(500).json({success:false, message: "Internal server error"});

    }
    
    
    return res.status(200).end();
  }
);
