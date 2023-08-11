import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { IRequestApp } from '@root/common/request/interfaces/request.interface';
import { UserDoc, UserEntity } from '../entities/user.entity';

import { UserPayloadPutToRequestGuard } from '../guards/payload/user.payload.put-to-request.guard';
import { UserNotFoundGuard } from '../guards/user.not-found.guard';

export const GetUser = createParamDecorator(
  (returnPlain: boolean, ctx: ExecutionContext): UserDoc | UserEntity => {
    const { __user } = ctx
      .switchToHttp()
      .getRequest<IRequestApp & { __user: UserDoc }>();
    return returnPlain ? __user.toObject() : __user;
  },
);

export function UserProtected(): MethodDecorator {
  return applyDecorators(
    UseGuards(UserPayloadPutToRequestGuard, UserNotFoundGuard),
  );
}
