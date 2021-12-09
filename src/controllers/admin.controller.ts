import { UploadedFile } from "express-fileupload";
import { Request, Response } from "express";
import { Controller as controller, Get as get, Post as post } from "@decorators/express";
import { Injectable } from "@decorators/di";
import Controller from "../core/controller.js";
import Category from "../models/category.model.js";
import User from "../models/user.model.js";
import AdminMiddleware from "../middleware/admin.middleware.js";

@controller("/admin", [AdminMiddleware])
@Injectable()
export default class AdminController extends Controller {
  constructor() {
    super();
  }

  @get("/")
  home(req: Request, res: Response) {
    return res.render("admin/home");
  }

  @get("/utilisateurs")
  async allUsers(req: Request, res: Response) {
    const users = await User.findAll();
    return res.render("admin/users/all", { users });
  }

  @get("utilisateurs/modifier/:username")
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

  @post("utilisateurs/modifier/:username")
  async updateUser_POST(req: Request, res: Response) {
    const currentUsername = req.params.username;
    const user = await User.findOne({ username: currentUsername });
    if (!user) {
      req.flash("errors", ["Aucun utilisateur trouvé avec ce nom."]);
      return res.redirect("/admin/utilisateurs");
    }

    user.username = req.body.username;
    user.role = req.body.role;
    user.verified = Boolean(req.body.verified);
    const errors = await user.getUpdateErrors(currentUsername);

    if (errors) {
      req.flash("errors", errors);
      return res.redirect(`/admin/utilisateurs/modifier/${currentUsername}`);
    }

    await user.update({
      username: user.username,
      role: user.role,
      verified: user.verified
    });
    return res.redirect("/admin/utilisateurs");
  }

  @get("/utilisateurs/supprimer/:id")
  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user)
      await user.delete();
    else
      req.flash("errors", ["Aucun utilisateur trouvé."]);
    return res.redirect("/admin/utilisateurs");
  }

  @get("/categories/ajouter")
  addCategory_GET(req: Request, res: Response) {
    const context = {
      category: req.session.temp.category ?? {}
    };
    delete req.session.temp.category;
    return res.render("admin/categories/add", context);
  }

  @post("/categories/ajouter")
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
    return res.redirect("/admin/categories");
  }
}