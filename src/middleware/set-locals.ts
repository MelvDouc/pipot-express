import { NextFunction, Request, Response } from "express";

const setLocals = (req: Request, res: Response, next: NextFunction) => {
  res.locals.flash_success = req.flash("success");
  res.locals.flash_errors = req.flash("errors");
  res.locals.app ??= {};
  res.locals.app.user = req.session.app.user ?? null;
  next();
};

export default setLocals;