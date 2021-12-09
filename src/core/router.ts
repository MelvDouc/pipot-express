import { attachControllers } from "@decorators/express";
import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import AuthController from "../controllers/auth.controller.js";
import categoryController from "../controllers/category.controller.js";
import productController from "../controllers/product.controller.js";
import profileController from "../controllers/profile.controller.js";
import siteController, { SiteController } from "../controllers/site.controller.js";

const router = Router();

router.use("/admin", adminController.getRouter());
router.use("/articles", productController.getRouter());
router.use("/categories", categoryController.getRouter());
router.use("/profil", profileController.getRouter());
// router.use("/auth", authController.getRouter());
// router.use("/", siteController.getRouter());
attachControllers(router, [SiteController, AuthController]);

export default router;

/*

  ===== ALL ROUTES =====

  /(accueil)? [x]
  /page-non-trouvee [x]
  /a-propos [x]

  [x]
  /auth/inscription
  /auth/connexion
  /auth/deconnexion

  [x]
  /categories
  /categories/:slug

  [x]
  /articles/ajouter
  /articles/:slug

  /profil/:username [x]
  /profil/:username/articles [x]
  /profil/:username/contacter

  /admin/
  /admin/categories
  /admin/categories/:slug/ajouter
  /admin/categories/:slug/modifier
  /admin/categories/:slug/supprimer
  /admin/utilisateurs/:username/modifier
  /admin/utilisateurs/:username/supprimer

*/