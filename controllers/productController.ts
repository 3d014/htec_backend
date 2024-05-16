import express, { Response, Request, Router } from "express";
import { Product } from "../models/Product";
import { protectedRoute } from "../middleware/auth-middleware";
import { Op } from "sequelize";

export const productsRouter: Router = express.Router();
productsRouter.get("/", protectedRoute, async (req: Request, res: Response) => {
  const { productId } = req.body;
  const limit = 10;
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

productsRouter.delete("/", protectedRoute, (req: Request, res: Response) => {
  const { productId } = req.body;
  if (productId) {
    Product.destroy({
      where: {
        productId : req.body.productId,
      },
    })
      .then(() => {
        return res
          .status(200)
          .json({ success: true, msg: "Product successfully deleted" });
      })
      .catch(() => {
        return res
          .status(400)
          .json({ success: false, msg: "Product doesn't exist" });
      });
  }
});

productsRouter.post(
  "/",
  protectedRoute,
  async (req: Request, res: Response) => {
    const { productName, measuringUnit, categoryId, description} = req.body;
    const product = await Product.create({
      productName,
      measuringUnit,
      categoryId,
      description
    });
    product.save();
    return res.status(200).end();
  }
);
