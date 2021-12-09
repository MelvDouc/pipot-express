import { Request, Response } from "express";
import { Controller as controller, Get as get } from "@decorators/express";
import { Injectable } from "@decorators/di";
import Controller from "../core/controller.js";
import Category from "../models/category.model.js";

@controller("/categories")
@Injectable()
export default class CategoryController extends Controller {
  constructor() {
    super();
  }

  @get("/:slug")
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

  @get("/")
  async all(req: Request, res: Response) {
    const categories = await Category.findAll();
    return res.render("categories/all", { categories });
  }
}