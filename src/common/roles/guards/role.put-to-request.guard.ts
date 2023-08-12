import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { IRequestApp } from 'src/common/request/interfaces/request.interface';
import { RoleDoc } from 'src/common/roles/entities/roles.entity';
import { RolesService } from 'src/common/roles/service/roles.service';

@Injectable()
export class RolePutToRequestGuard implements CanActivate {
  constructor(private readonly roleService: RolesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<IRequestApp & { __role: RoleDoc }>();
    const { params } = request;
    const { id } = params;

    const check: RoleDoc = await this.roleService.findOneById(id, {
      join: true,
    });
    request.__role = check;

    return true;
  }
}
