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
  }

  public getRouter() {
    return this.router;
  }
}