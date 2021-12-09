import { Request, Response, NextFunction } from "express";
import { Middleware as ExpressMiddleware } from "@decorators/express";

type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => any;

const Middleware = (middlewareFunc: MiddlewareFunction) => {
  return class M implements ExpressMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
      middlewareFunc(req, res, next);
    }
  };
};

export default Middleware;