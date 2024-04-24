import express, { Response, Request, Router } from "express";
import { Product } from "../models/Product";
import { protectedRoute } from "../middleware/auth-middleware";
import { Op } from "sequelize";

export const productsRouter: Router = express.Router();
productsRouter.get("/", protectedRoute, async (req: Request, res: Response) => {
  const { productName } = req.body;
  const limit = 10;
  let products;
  if (!productName) {
    products = await Product.findAll();
  } else {
    products = await Product.findAll({
      where: {
        productName: { [Op.startsWith]: productName },
      },
    });
  }

  return res.send(products);
});
productsRouter.delete("/", protectedRoute, (req: Request, res: Response) => {
  const { productName } = req.body;
  if (productName) {
    Product.destroy({
      where: {
        productName: req.body.productName,
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
    const { productName, measuringUnit } = req.body;
    const product = await Product.create({
      productName,
      measuringUnit,
    });
    product.save();
    return res.status(200).end();
  }
);
