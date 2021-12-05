import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import Controller from "../core/controller.js";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

class ProductController extends Controller {
  constructor() {
    super();
    this.router.route("/ajouter")
      .get(this.add_GET)
      .post(this.add_POST);
    this.router.get("/:slug", this.single);
  }

  async single(req: Request, res: Response) {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });
    if (!product)
      return res.redirect("/page-non-trouvee");
    return res.render("public/products/single", { product });
  }

  async add_GET(req: Request, res: Response) {
    if (!req.session.app.user)
      return res.redirect("/connexion");

    const categories = await Category.findAll();
    const context = {
      product: req.session.temp.product ?? {},
      categories
    };
    delete req.session.temp.product;
    return res.render("public/products/add", context);
  }

  async add_POST(req: Request, res: Response) {
    const product = new Product();
    product.name = req.body.name?.trim();
    product.description = req.body.description?.trim();
    product.price = parseInt(req.body.price);
    product.quantity = parseInt(req.body.quantity);
    product.image = (req.files?.image as UploadedFile) ?? null;
    product.setCategoryId(req.body.category_id);
    product.setSellerId(req.session.app.user._id);
    const temp_product = product.toObjectLiteral();
    const errors = await product.getCreationErrors();

    if (errors) {
      req.flash("errors", errors);
      req.session.temp.product = temp_product;
      return res.redirect("/articles/ajouter");
    }

    await product.insert();
    return res.redirect(`/articles/${product.slug}`);
  }
}

const productController = new ProductController();
export default productController;