import Controller from "../core/controller.js";
import { Request, Response } from "express";
import User from "../models/user.model.js";
import { Controller as controller, Get as get } from "@decorators/express";
import { Injectable } from "@decorators/di";

@controller("/")
@Injectable()
export class SiteController extends Controller {
  constructor() {
    super();
    // this.router.get("/a-propos", this.about);
    // this.router.get("/page-non-trouvee", this.notFound);
    // this.router.get("/activation", this.accountActivation);
    // this.router.get(/\/(accueil)?/, this.home);
  }

  @get("/")
  home(req: Request, res: Response) {
    return res.render("site/home");
  }

  about(req: Request, res: Response) {
    return res.render("site/about");
  }

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

  notFound(req: Request, res: Response) {
    return res.status(404).render("site/404");
  }
}

const siteController = new SiteController();
export default siteController;