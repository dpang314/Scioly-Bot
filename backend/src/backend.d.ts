declare namespace Express {
  export interface User {
    id: string;
  }
  export interface Request {
    user?: User | undefined;
  }
}