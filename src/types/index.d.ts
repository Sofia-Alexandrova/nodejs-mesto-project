export type AuthContext = {
  user: {
    _id: string;
  };
};

declare global {
  namespace Express {
    interface Request {
      user?: AuthContext["user"];
    }
  }
}
