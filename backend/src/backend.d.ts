import {UserAttributes} from './models/User';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface User extends UserAttributes {}
    export interface Request {
      user?: User | undefined;
    }
  }
}
