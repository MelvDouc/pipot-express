import { Router } from "express";
import { attachControllers } from "@decorators/express";
import AdminController from "../controllers/admin.controller.js";
import AuthController from "../controllers/auth.controller.js";
import CategoryController from "../controllers/category.controller.js";
import ProductController from "../controllers/product.controller.js";
import ProfileController from "../controllers/profile.controller.js";
import SiteController from "../controllers/site.controller.js";

const router = Router();

attachControllers(router, [
  AdminController,
  AuthController,
  CategoryController,
  ProfileController,
  ProductController,
  SiteController
]);

export default router;

/*

  ===== ALL ROUTES =====

  / [x]
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