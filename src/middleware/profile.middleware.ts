import { Request, Response, NextFunction } from "express";
import Middleware from "../core/middleware.js";
import User from "../models/user.model.js";

const ProfileMiddleware = Middleware((async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;
  const user = await User.findOne({ username });
  if (!user)
    return res.redirect("/page-non-trouvee");
  res.locals.user = user.deletePasswords() as User;
  res.locals.is_own_profile = user.username === req.session.app.user?.username;
  next();
}));

export default ProfileMiddleware;