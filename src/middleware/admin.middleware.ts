import { Request, Response, NextFunction } from "express";
import Middleware from "../core/middleware.js";
import User from "../models/user.model.js";

const AdminMiddleware = Middleware((req: Request, res: Response, next: NextFunction) => {
  const app_user = req.session.app.user;

  if (!app_user)
    return res.redirect("/auth/connexion");

  if (app_user.role !== User.roles.ADMIN) {
    req.flash("errors", ["Non autorisé."]);
    return res.redirect("/");
  }

  next();
});

export default AdminMiddleware;