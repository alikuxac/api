import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { ENUM_USER_STATUS_CODE_ERROR } from 'src/modules/api/users/constants/user.status-code.constant';
import { UserDoc } from 'src/modules/api/users/entities/user.entity';

@Injectable()
export class UserCanNotOurSelfGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { _user, user } = context
      .switchToHttp()
      .getRequest<IRequestApp & { _user: UserDoc }>();

    if (_user._id === user.id) {
      throw new NotFoundException({
        statusCode: ENUM_USER_STATUS_CODE_ERROR.USER_NOT_FOUND_ERROR,
        message: 'user.error.notFound',
      });
    }

    return true;
  }
}
