import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsersService } from '@root/modules/api/users/services/users.service';
import { RolesService } from '@root/common/roles/service/roles.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user) {
      const userEntity = await this.usersService.findOne(user._id);
      const roleEntity = await this.rolesService.findOne(user.role);
      request._user = userEntity; // Add the user object to the request
      request._role = roleEntity; // Add the role object to the request
    }

    return next.handle().pipe(
      map((data) => {
        return data;
      }),
    );
  }
}
