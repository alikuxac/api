export * from './users.controller';
export * from './user_personal.controller';

import { UsersController } from './users.controller';
import { UserPersonalController } from './user_personal.controller';

export const userControllers = [UsersController, UserPersonalController];
