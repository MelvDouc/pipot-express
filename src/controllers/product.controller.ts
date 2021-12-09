import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { Controller as controller, Get as get, Post as post } from "@decorators/express";
import { Injectable } from "@decorators/di";
import Controller from "../core/controller.js";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

@controller("/articles")
@Injectable()
export default class ProductController extends Controller {
  constructor() {
    super();
  }

  @get("/:slug")
  async single(req: Request, res: Response) {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });
    if (!product)
      return res.redirect("/page-non-trouvee");
    return res.render("products/single", { product });
  }

  @get("/ajouter")
  async add_GET(req: Request, res: Response): Promise<void> {
    const categories = await Category.findAll();
    const context = {
      product: req.session.temp.product ?? {},
      categories
    };
    delete req.session.temp.product;
    return res.render("products/add", context);
  }

  @post("/ajouter")
  async add_POST(req: Request, res: Response) {
    const product = new Product();
    product.name = req.body.name;
    product.description = req.body.description;
    product.price = parseInt(req.body.price);
    product.quantity = parseInt(req.body.quantity);
    product.imageFile = (req.files?.image as UploadedFile) ?? null;
    product
      .setCategoryId(req.body.category_id)
      .setSellerId(req.session.app.user._id);
    const errors = await product.getCreationErrors();

    if (errors) {
      req.flash("errors", errors);
      req.session.temp.product = product.toObjectLiteral();
      return res.redirect("/articles/ajouter");
    }

    await product.insert();
    return res.redirect(`/articles/${product.slug}`);
  }

  @get("/rechercher")
  async search(req: Request, res: Response) {
    const search = (<string>req.query.q ?? "").trim().toLowerCase();
    const $regex = search.replace(/\s+/g, "|");
    const detail = {
      $regex,
      $options: "i"
    };
    const products = await Product.findAll({
      $or: [
        { name: detail },
        { description: detail }
      ]
    });
    return res.render("products/search", {
      products: (products.length) ? products : null
    });
  }
}