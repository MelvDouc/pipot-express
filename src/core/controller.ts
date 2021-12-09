import { Router, Request, Response, NextFunction } from "express";
import { csrfProtection, sanitize } from "../middleware/index.js";

export default abstract class Controller {
  protected router: Router;

  constructor() {
    this.router = Router();

    // const methods = Object.getOwnPropertyNames(this.constructor.prototype);
    // methods.forEach((methodName) => {
    //   if (methodName === "constructor")
    //     return;
    //   const method = <Function>this[methodName as keyof Controller];
    //   this[methodName as keyof Controller] = method.bind(this);
    // });

    this.router.use(sanitize);
  }

  public getRouter() {
    return this.router;
  }

  protected redirectIfNotLoggedIn(req: Request, res: Response, next: NextFunction) {
    if (!req.session.app.user)
      return res.redirect("/auth/connexion");
    next();
  }

  protected csrfProtection(req: Request, res: Response, next: NextFunction) {
    return csrfProtection(req, res, next);
  }
}