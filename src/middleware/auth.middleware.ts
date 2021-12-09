import { Request, Response, NextFunction } from "express";
import Middleware from "../core/middleware.js";
import csurf from "csurf";

const AuthMiddleware = Middleware((req: Request, res: Response, next: NextFunction) => {
  csurf({ cookie: true })(req, res, next);
});

export default AuthMiddleware;