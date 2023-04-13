import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import {
  IPolicyAbility,
  IPolicyRule,
  IPolicyRuleAbility,
  PolicyHandler,
} from 'src/common/policy/interfaces/policy.interface';
import { Role } from 'src/common/roles/entities/roles.entity';

@Injectable()
export class PolicyAbilityFactory {
  defineAbilityFromRole({ permissions }: Role) {
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

  mappingAbility({ subject, action }: IPolicyRule): IPolicyRuleAbility[] {
    return action
      .map((val) => ({
        action: val,
        subject,
      }))
      .flat(1);
  }
}
