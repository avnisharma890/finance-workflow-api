declare namespace Express {
  interface UserPayload {
    id: string;
    role?: string;
  }

  interface Request {
    user?: UserPayload;
  }
}