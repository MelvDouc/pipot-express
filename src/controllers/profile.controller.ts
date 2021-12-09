import { Request, Response } from "express";
import { Controller as controller, Get as get } from "@decorators/express";
import { Injectable } from "@decorators/di";
import Controller from "../core/controller.js";
import User from "../models/user.model.js";
import ProfileMiddleware from "../middleware/profile.middleware.js";

@controller("/profil/:username", [ProfileMiddleware])
@Injectable()
export default class ProfileController extends Controller {
  constructor() {
    super();
  }

  @get("/")
  index(req: Request, res: Response) {
    const user = res.locals.user as User;
    return res.render("profile/index", {
      user: user.toObjectLiteral(),
      is_own_profile: res.locals.is_own_profile
    });
  }

  @get("/articles")
  async products(req: Request, res: Response) {
    const user = res.locals.user as User;
    const products = await user.getProducts();
    return res.render("profile/products", {
      user: user.toObjectLiteral(),
      products,
      is_own_profile: res.locals.is_own_profile
    });
  }

  @get("/contacter")
  contact_GET(req: Request, res: Response) {
    if (!req.session.app.user)
      return res.redirect("/auth/connexion");

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