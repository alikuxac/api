import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsersService } from '@root/modules/api/users/services/users.service';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user) {
      const userEntity = await this.usersService.findOne(user._id);
      request._user = userEntity; // Add the user object to the request
    }

    return next.handle().pipe(
      map((data) => {
        return data;
      }),
    );
  }
}
