import {User as UserModel} from './models';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface User extends UserModel {}
    export interface Request {
      user?: User;
    }
  }
}
