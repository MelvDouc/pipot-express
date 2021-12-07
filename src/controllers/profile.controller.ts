import { NextFunction, Request, Response } from "express";
import Controller from "../core/controller.js";
import User from "../models/user.model.js";

export class ProfileController extends Controller {
  constructor() {
    super();
    this.router.param("username", this.getUser)
      .get("/:username/articles", this.products)
      .get("/:username/contacter", this.redirectIfNotLoggedIn, this.contact_GET)
      .get("/:username", this.index);
  }

  async getUser(req: Request, res: Response, next: NextFunction, username: string) {
    const user = await User.findOne({ username });
    if (!user)
      return res.redirect("/page-non-trouvee");
    res.locals.user = user.deletePasswords() as User;
    res.locals.is_own_profile = user.username === req.session.app.user?.username;
    next();
  }

  index(req: Request, res: Response) {
    const user = res.locals.user as User;
    return res.render("profile/index", {
      user: user.toObjectLiteral(),
      is_own_profile: res.locals.is_own_profile
    });
  }

  async products(req: Request, res: Response) {
    const user = res.locals.user as User;
    const products = await user.getProducts();
    return res.render("profile/products", {
      user: user.toObjectLiteral(),
      products,
      is_own_profile: res.locals.is_own_profile
    });
  }

  contact_GET(req: Request, res: Response) {
    const appUser = req.session.app.user as User;
    const profileUser = res.locals.user as User;

    if (appUser.username === profileUser.username)
      return res.redirect(`profil/${appUser.username}`);

    return res.render("profile/contact", {
      username: profileUser.username,
      message: req.session.temp.message ?? {}
    });
  }
}

const profileController = new ProfileController();
export default profileController;