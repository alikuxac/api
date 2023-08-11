import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { UserDoc } from 'src/modules/api/users/entities/user.entity';
import { UsersService } from 'src/modules/api/users/services/users.service';

@Injectable()
export class UserPutToRequestGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<IRequestApp & { _user: UserDoc }>();
    const { params } = request;
    const { id } = params;

    const check: UserDoc = await this.userService.findOneById(id);
    request._user = check;

    return true;
  }
}
