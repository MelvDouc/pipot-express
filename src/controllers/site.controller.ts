import Controller from "../core/controller.js";
import { Request, Response } from "express";

class SiteController extends Controller {
  constructor() {
    super();
    this.router.get("/a-propos", this.about);
    this.router.get("/page-non-trouvee", this.notFound);
    this.router.get(/\/(accueil)?/, this.home);
  }

  home(req: Request, res: Response) {
    return res.render("site/home");
  }

  about(req: Request, res: Response) {
    return res.render("site/about");
  }

  notFound(req: Request, res: Response) {
    return res.status(404).render("site/404");
  }
}

const siteController = new SiteController();
export default siteController;