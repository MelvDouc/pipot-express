declare namespace Express {
  export interface Request {
    username?: string;
    is_own_profile?: boolean;
  }
}