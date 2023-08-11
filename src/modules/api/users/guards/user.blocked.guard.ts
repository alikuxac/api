import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { USER_BLOCKED_META_KEY } from 'src/modules/api/users/constants/user.constant';
import { ENUM_USER_STATUS_CODE_ERROR } from 'src/modules/api/users/constants/user.status-code.constant';
import { UserDoc } from 'src/modules/api/users/entities/user.entity';

@Injectable()
export class UserBlockedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required: boolean[] = this.reflector.getAllAndOverride<boolean[]>(
      USER_BLOCKED_META_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required) {
      return true;
    }

    const { _user } = context
      .switchToHttp()
      .getRequest<IRequestApp & { _user: UserDoc }>();

    if (!required.includes(_user.isBanned)) {
      throw new BadRequestException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_BLOCKED_ERROR,
        message: 'user.error.blocked',
      });
    }
    return true;
  }
}
