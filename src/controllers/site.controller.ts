import Controller from "../core/controller.js";
import Category from "../models/category.model.js";
import User from "../models/user.model.js";
import { Request, Response } from "express";

class SiteController extends Controller {
  constructor() {
    super();
    this.router.get("/categories/:slug", this.singleCategory);
    this.router.get("/categories", this.allCategories);
    this.router.get("/profil/:username", this.profile);
    this.router.get("/page-non-trouvee", this.notFound);
    this.router.get(/^\/(accueil)?$/, this.home);
  }

  home(req: Request, res: Response) {
    return res.render("public/home");
  }

  notFound(req: Request, res: Response) {
    return res.render("public/404");
  }

  async allCategories(req: Request, res: Response) {
    const categories = await Category.findAll();
    return res.render("public/categories/all", { categories });
  }

  async singleCategory(req: Request, res: Response) {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });

    if (!category)
      return res.status(404).send("Catégorie non trouvée.");

    const products = await category.findProducts();

    return res.render("public/categories/single", {
      title: `Catégorie ${category.name}`,
      products
    });
  }

  async profile(req: Request, res: Response) {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user)
      return res.redirect("/page-non-trouvee");
    return res.render("public/profile", { user });
  }
}

const siteController = new SiteController();
export default siteController;