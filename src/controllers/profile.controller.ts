import { Request, Response } from "express";
import Controller from "../core/controller.js";
import User from "../models/user.model.js";

class ProfileController extends Controller {
  constructor() {
    super();
    this.router.get("/:username", this.index);
  }

  async index(req: Request, res: Response) {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user)
      return res.redirect("/page-non-trouvee");
    return res.render("profile/index", { user });
  }
}

const profileController = new ProfileController();
export default profileController;