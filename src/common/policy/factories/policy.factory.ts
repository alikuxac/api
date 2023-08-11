import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { UserPayloadPermissionSerialization } from '@root/modules/api/users/serializations/user.payload.serialization';
import {
  IPolicyAbility,
  IPolicyRequest,
  IPolicyRule,
  IPolicyRuleAbility,
  PolicyHandler,
} from 'src/common/policy/interfaces/policy.interface';
import {
  RolePermission,
  RoleRequestPermission,
} from 'src/common/policy/constants/policy.enum.constant';

import { HelperNumberService } from '@root/common/helper/services/helper.number.service';

@Injectable()
export class PolicyAbilityFactory {
  constructor(private readonly helperNumberService: HelperNumberService) {}

  defineAbilityFromRole({ permissions }: IPolicyRequest) {
    const { can, build } = new AbilityBuilder<IPolicyAbility>(
      createMongoAbility,
    );

    for (const permission of permissions) {
      const abilities = this.mappingAbility(permission);

      for (const ability of abilities) {
        can(ability.action, ability.subject);
      }
    }

    return build();
  }

  mappingRules(rules: IPolicyRule[]): PolicyHandler[] {
    return rules
      .map(({ subject, action }) => {
        return action
          .map((val) => (ability: IPolicyAbility) => ability.can(val, subject))
          .flat(1);
      })
      .flat(1);
  }

  mappingRequestRule(action: number): RolePermission {
    switch (action) {
      case RoleRequestPermission.MANAGE:
        return RolePermission.MANAGE;
      case RoleRequestPermission.READ:
        return RolePermission.READ;
      case RoleRequestPermission.CREATE:
        return RolePermission.CREATE;
      case RoleRequestPermission.UPDATE:
        return RolePermission.UPDATE;
      case RoleRequestPermission.DELETE:
        return RolePermission.DELETE;
      default:
        return null;
    }
  }

  mappingAbility({
    subject,
    action,
  }: UserPayloadPermissionSerialization): IPolicyRuleAbility[] {
    return action
      .split(',')
      .map((val: string) => ({
        action: this.mappingRequestRule(this.helperNumberService.create(val)),
        subject,
      }))
      .flat(1);
  }

  handlerRules(rules: IPolicyRule[]): PolicyHandler[] {
    return rules
      .map(({ subject, action }) => {
        return action
          .map((val) => (ability: IPolicyAbility) => ability.can(val, subject))
          .flat(1);
      })
      .flat(1);
  }
}
