import { Request, Response } from "express";
import { Controller as controller, Get as get } from "@decorators/express";
import { Injectable } from "@decorators/di";
import User from "../models/user.model.js";
import Controller from "../core/controller.js";

@controller("/")
@Injectable()
export default class SiteController extends Controller {
  constructor() {
    super();
  }

  @get("/")
  home(req: Request, res: Response) {
    return res.render("site/home");
  }

  @get("/a-propos")
  about(req: Request, res: Response) {
    return res.render("site/about");
  }

  @get("/activation")
  async accountActivation(req: Request, res: Response) {
    const { verif_string } = req.query;
    if (!verif_string || typeof verif_string !== "string")
      return res.redirect("/page-non-trouvee");
    const user = await User.findOne({ verif_string });
    if (!user)
      return res.redirect("/page-non-trouvee");
    await user.verify();
    req.flash("success", "Votre compte est à présent actif. Vous pouvez vous connecter.");
    return res.redirect(`/auth/connexion`);
  }

  @get("/page-non-trouvee")
  notFound(req: Request, res: Response) {
    return res.status(404).render("site/404");
  }
}