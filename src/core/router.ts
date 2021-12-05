import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import authController from "../controllers/auth.controller.js";
import productController from "../controllers/product.controller.js";
import siteController from "../controllers/site.controller.js";

const router = Router();

router.use("/admin", adminController.getRouter());
router.use("/articles", productController.getRouter());
router.use("/", authController.getRouter(), siteController.getRouter());

export default router;