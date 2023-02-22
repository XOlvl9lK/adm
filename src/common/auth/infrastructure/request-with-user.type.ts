import { User } from './user.interface';

export type RequestWithUser = Request & {
  user?: User;
};
