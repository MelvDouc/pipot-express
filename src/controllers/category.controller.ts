import { Request, Response } from "express";
import Controller from "../core/controller.js";
import Category from "../models/category.model.js";

class CategoryController extends Controller {
  constructor() {
    super();
    this.router.get("/:slug", this.single);
    this.router.get("/", this.all);
  }

  async single(req: Request, res: Response) {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });

    if (!category)
      return res.redirect("/page-non-trouvee");

    const products = await category.findProducts();

    return res.render("categories/single", {
      title: `Catégorie ${category.name}`,
      products
    });
  }

  async all(req: Request, res: Response) {
    const categories = await Category.findAll();
    return res.render("categories/all", { categories });
  }
}

const categoryController = new CategoryController();
export default categoryController;