import { NextFunction, Request, Response } from "express";
import Controller from "../core/controller.js";
import User from "../models/user.model.js";

export class ProfileController extends Controller {
  constructor() {
    super();
    this.router.param("username", this.getUser);
    this.router.get("/:username", this.index);
  }

  async getUser(req: Request, res: Response, next: NextFunction, username: string) {
    const user = await User.findOne({ username });
    if (!user)
      return res.redirect("/page-non-trouvee");
    req.username = user.username;
    req.is_own_profile = user.username === req.session.app.user?.username;
    next();
  }

  async index(req: Request, res: Response) {
    const user = await User.findOne({ username: req.username }) as User;
    return res.render("profile/index", {
      user: user.toObjectLiteral(),
      is_own_profile: req.is_own_profile
    });
  }

  async products(req: Request, res: Response) {
    const user = await User.findOne({ user: req.username }) as User;
    const products = await user.getProducts();
    return res.render("profile/products", {
      user: user.toObjectLiteral(),
      products,
      is_own_profile: req.is_own_profile
    });
  }
}

const profileController = new ProfileController();
export default profileController;