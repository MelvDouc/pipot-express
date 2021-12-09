import { Request, Response } from "express";
import { Controller as controller, Get as get, Post as post } from "@decorators/express";
import { Injectable } from "@decorators/di";
import Controller from "../core/controller.js";
import User from "../models/user.model.js";
import AuthMiddleware from "../middleware/auth.middleware.js";

@controller("/auth")
@Injectable()
export default class AuthController extends Controller {
  constructor() {
    super();
  }

  // Middleware (not working with router.use())
  redirectToProfile(req: Request, res: Response) {
    req.session as any;
    if (!req.session.app.user)
      return;
    return res.redirect(`/profil/${req.session.app.user.username}`);
  }

  @get("/inscription", [AuthMiddleware])
  register_GET(req: Request, res: Response) {
    const context = {
      user: req.session.temp.user ?? {},
      registered: Boolean(req.session.temp.registered),
      email: req.session.temp.email ?? "",
      csrf_token: req.csrfToken()
    };
    delete req.session.temp.user;
    delete req.session.temp.registered;
    delete req.session.temp.email;
    return res.render("auth/register", context);
  }

  @post("/inscription", [AuthMiddleware])
  async register_POST(req: Request, res: Response) {
    const user = new User();
    user.username = req.body.username?.trim();
    user.email = req.body.email?.trim();
    user.plain_password = req.body.plain_password;
    user.confirm_password = req.body.confirm_password;
    const errors = await user.getRegisterErrors();

    if (errors) {
      req.session.temp.user = { username: user.username, email: user.email };
      return res.redirect("/auth/inscription");
    }

    try {
      await user.register();
      req.session.temp.registered = true;
      req.session.temp.email = user.email;
    } catch (_e) {
      req.flash("errors", ["Une erreur s'est produite. Veuillez réessayer."]);
    } finally {
      return res.redirect("/auth/inscription");
    }
  }

  @get("/connexion", [AuthMiddleware])
  login_GET(req: Request, res: Response) {
    return res.render("auth/login", {
      csrf_token: req.csrfToken()
    });
  }

  @post("/connexion", [AuthMiddleware])
  async login_POST(req: Request, res: Response) {
    const { uuid, plain_password } = req.body;
    const user: User | null = await User.findOne({
      $or: [
        { username: uuid },
        { email: uuid }
      ]
    });

    if (!user) {
      req.flash("errors", ["Identifiants incorrects."]);
      return res.redirect("/auth/connexion");
    }

    user.plain_password = plain_password;
    const isRightPassword = await (<User>user).checkPassword();
    if (!isRightPassword) {
      req.flash("errors", ["Identifiants incorrects."]);
      return res.redirect("/auth/connexion");
    }

    req.session.app.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      verified: user.verified,
      added_at: user.added_at
    };
    req.flash("success", "Connection réussie.");
    if (user.isAdmin())
      return res.redirect("/admin");
    return res.redirect(`/profil/${user.username}`);
  }

  @get("/deconnexion")
  logout(req: Request, res: Response) {
    if (!req.session.app.user)
      return res.redirect(req.header("Referer") ?? "/");
    req.session.app.user = null;
    req.flash("success", "Vous avez bien été déconnecté(e).");
    return res.redirect("/");
  }
}