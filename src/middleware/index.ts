import csurf from "csurf";
import { NextFunction, Request, Response } from "express";

export const csrfProtection = csurf({ cookie: true });

export function methodOverride(req: Request, _res: Response, next: NextFunction) {
  const allowedMethods = ["PUT", "PATCH", "DELETE"];
  const method = <string>req.query._method ?? "";
  const METHOD = method.toUpperCase();
  if (METHOD && allowedMethods.includes(METHOD))
    req.method = METHOD;
  next();
};

export function setLocals(req: Request, res: Response, next: NextFunction) {
  res.locals.flash_success = req.flash("success");
  res.locals.flash_errors = req.flash("errors");
  res.locals.app ??= {};
  res.locals.app.user = req.session.app.user ?? null;
  next();
};

export function setSessionVars(req: Request, _res: Response, next: NextFunction) {
  req.session.app ??= {};
  req.session.temp ??= {};
  next();
}

export function sanitize(req: Request, _res: Response, next: NextFunction) {
  for (const key in req.body) {
    const value = req.body[key];
    if (typeof value !== "string")
      continue;
    req.body[key] = value.trim().replace(/(<|>)/g, "\\$1");
  }
  next();
}