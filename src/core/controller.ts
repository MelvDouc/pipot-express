import { Router } from "express";

export default abstract class Controller {
  protected router: Router;

  constructor() {
    this.router = Router();

    const methods = Object.getOwnPropertyNames(this.constructor.prototype);
    methods.forEach((methodName) => {
      if (methodName === "constructor")
        return;
      const method = <Function>this[methodName as keyof Controller];
      this[methodName as keyof Controller] = method.bind(this);
    });

    this.router.use((req, _res, next) => {
      if (Object.keys(req.body).length)
        req.body = this.sanitize(req.body);
      next();
    });
  }

  public getRouter() {
    return this.router;
  }

  private sanitize(body: { [key: string]: string; }) {
    const result: { [key: string]: string; } = {};
    for (const key in body)
      result[key] = body[key].trim();
    return result;
  }
}