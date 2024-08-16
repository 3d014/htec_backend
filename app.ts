import cors from "cors";
import { userRouter } from "./controllers/UserController/userController";
import { authRouter } from "./controllers/authController";
import { resetPasswordRouter } from "./controllers/resetPasswordController";
import { sequelize } from "./db/SequalizeSetup";
import { productsRouter } from "./controllers/ProductController/productController";
import { vendorRouter } from "./controllers/VendorController/vendorController";
import { budgetRouter }from "./controllers/BudgetController/budgetController";
import { categoriesRouter } from "./controllers/CategoryController/categoryController";
import { invoiceRouter } from "./controllers/InvoiceController/invoiceController";
import { measuringUnitRouter } from "./controllers/MeasuringUnitController/measuringUnitController";
import express from "express";


export const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users/", userRouter);
app.use("/api/auth/", authRouter);
app.use("/api/reset/password/", resetPasswordRouter);
app.use("/api/products", productsRouter);
app.use("/api/vendors",vendorRouter);
app.use("/api/budget/", budgetRouter);
app.use("/api/invoices",invoiceRouter);
app.use("/api/categories",categoriesRouter);
app.use("/api/measuringUnits",measuringUnitRouter);



(async () => {
  await sequelize.sync({ force: false});
  app.listen(5000, () => {
    console.log("App listening on port 5000");
  });
})();
