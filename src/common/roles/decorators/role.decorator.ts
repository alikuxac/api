import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { IRequestApp } from '@root/common/request/interfaces/request.interface';
import { RoleDoc, RoleEntity } from '../entities/roles.entity';

export const GetRole = createParamDecorator(
  (returnPlain: boolean, ctx: ExecutionContext): RoleDoc | RoleEntity => {
    const { __role } = ctx
      .switchToHttp()
      .getRequest<IRequestApp & { __role: RoleDoc }>();
    return returnPlain ? __role.toObject() : __role;
  },
);
