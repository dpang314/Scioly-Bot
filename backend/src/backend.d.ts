import { UserAttributes } from './models/User';

declare global {
  namespace Express {
    export interface User extends UserAttributes {}
    export interface Request {
      user?: User | undefined;
    }
  }
}
