import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import authController from "../controllers/auth.controller.js";
import categoryController from "../controllers/category.controller.js";
import productController from "../controllers/product.controller.js";
import profileController from "../controllers/profile.controller.js";
import siteController from "../controllers/site.controller.js";

const router = Router();

router.use("/admin", adminController.getRouter());
router.use("/articles", productController.getRouter());
router.use("/categories", categoryController.getRouter());
router.use("/profil", profileController.getRouter());
router.use("/auth", authController.getRouter());
router.use("/", siteController.getRouter());

export default router;

/*

  ===== ALL ROUTES =====

  /(accueil)?
  /page-non-trouvee
  /a-propos

  /auth/inscription
  /auth/connexion
  /auth/deconnexion

  /categories
  /categories/:slug

  /articles/:slug
  /articles/ajouter

  /profil/:username
  /profil/:username/articles
  /profil/:username/contacter

  /mon-profil
  /mon-profil/articles
  /mon-profil/articles/:slug/modifier
  /mon-profil/articles/:slug/supprimer

  /admin/
  /admin/connexion
  /admin/categories
  /admin/categories/:slug/ajouter
  /admin/categories/:slug/modifier
  /admin/categories/:slug/supprimer
  /admin/utilisateurs/:username/modifier
  /admin/utilisateurs/:username/supprimer

*/