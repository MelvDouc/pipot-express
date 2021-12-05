import { NextFunction, Request, Response } from "express";

const allowedMethods = ["PUT", "PATCH", "DELETE"];

const methodOverride = (req: Request, _res: Response, next: NextFunction) => {
  const method = <string>req.query._method ?? "";
  const METHOD = method.toUpperCase();
  if (METHOD && allowedMethods.includes(METHOD))
    req.method = METHOD;
  next();
};

export default methodOverride;