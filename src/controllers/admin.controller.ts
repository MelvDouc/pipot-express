import { UploadedFile } from "express-fileupload";
import { NextFunction, Request, Response } from "express";
import Controller from "../core/controller.js";
import Category from "../models/category.model.js";
import User from "../models/user.model.js";

class AdminController extends Controller {
  constructor() {
    super();
    this.router.use(this.redirectToLogin);
    this.router.route("/utilisateurs/modifier/:username")
      .get(this.updateUser_GET)
      .post(this.updateUser_POST);
    this.router.delete("/utilisateurs/supprimer/:id", this.deleteUser);
    this.router.get("/utilisateurs", this.usersList);
    this.router.route("/categories/ajouter")
      .get(this.addCategory_GET)
      .post(this.addCategory_POST);
    this.router.get(/^\/(accueil)?$/, this.home);
  }

  // middleware
  redirectToLogin(req: Request, res: Response, next: NextFunction) {
    const app_user = req.session.app.user;

    if (!app_user)
      return res.redirect("/auth/connexion");

    if (app_user.role !== User.roles.ADMIN) {
      req.flash("errors", ["Non autorisé."]);
      return res.redirect("/");
    }

    next();
  }

  home(req: Request, res: Response) {
    return res.render("admin/home");
  }

  async usersList(req: Request, res: Response) {
    const users = await User.findAll();
    return res.render("admin/users/all", { users });
  }

  async updateUser_GET(req: Request, res: Response) {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
      req.flash("errors", ["Pas d'utilisateur avec ce nom."]);
      return res.redirect("/admin/utilisateurs");
    }
    const roles = Object.values(User.roles);
    return res.render("admin/users/update", { user, roles });
  }

  async updateUser_POST(req: Request, res: Response) {
    const currentUsername = req.params.username;
    const user = await User.findOne({ username: currentUsername });
    if (!user) {
      req.flash("errors", ["Pas d'utilisateur avec ce nom."]);
      return res.redirect("/admin/utilisateurs");
    }

    user.username = req.body.username;
    user.role = req.body.role;
    user.verified = "verified" in req.body;
    const errors = await user.getUpdateErrors(currentUsername);

    if (errors) {
      req.flash("errors", errors);
      return res.redirect(`/admin/utilisateurs/modifier/${currentUsername}`);
    }

    await user.update();
    return res.redirect("/admin/utilisateurs");
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const user = await User.findById(id);
    await user.delete();
    return res.redirect("/admin/utilisateurs");
  }

  addCategory_GET(req: Request, res: Response) {
    const context = {
      category: req.session.temp.category ?? {}
    };
    delete req.session.temp.category;
    return res.render("admin/categories/add", context);
  }

  async addCategory_POST(req: Request, res: Response) {
    const category = new Category();
    category.name = req.body.name;
    category.description = req.body.description;
    category.slug = req.body.slug;
    if (req.files?.image)
      category.imageFile = req.files.image as UploadedFile;

    const errors = await category.getCreationErrors();
    if (errors) {
      req.session.temp.category = category.toObjectLiteral();
      req.flash("errors", errors);
      return res.redirect("/admin/categories/ajouter");
    }
    await category.insert();
    req.flash("success", "La catégorie a bien été ajoutée.");
    return res.redirect("/admin");
  }
}

const adminController = new AdminController();
export default adminController;