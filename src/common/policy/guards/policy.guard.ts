import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { POLICY_RULE_META_KEY } from 'src/common/policy/constants/policy.constant';
import { PolicyAbilityFactory } from '../factories/policy.factory';
import {
  IPolicyAbility,
  IPolicyRule,
  PolicyHandler,
} from '../interfaces/policy.interface';
import { IRequestApp } from '@root/common/request/interfaces/request.interface';

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly policyAbilityFactory: PolicyAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyRule =
      this.reflector.get<IPolicyRule[]>(
        POLICY_RULE_META_KEY,
        context.getHandler(),
      ) || [];

    const { user } = context.switchToHttp().getRequest<IRequestApp>();
    const { permissions } = user;

    if (user.isOwner) return true;
    const ability = this.policyAbilityFactory.defineAbilityFromRole({
      permissions,
    });

    const policyHandler: PolicyHandler[] =
      this.policyAbilityFactory.mappingRules(policyRule);
    const check: boolean = policyHandler.every((handler: PolicyHandler) => {
      return this.execPolicyHandler(handler, ability);
    });

    if (!check) {
      throw new ForbiddenException({
        statusCode: 301,
        message: 'policy.error.abilityForbidden',
      });
    }

    return true;
  }

  private execPolicyHandler(handler: PolicyHandler, ability: IPolicyAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
