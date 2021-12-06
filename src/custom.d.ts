declare namespace Express {
  import User from "./models/user.model.js";

  export interface Request {
    profile_user?: User;
    is_own_profile?: boolean;
  }
}