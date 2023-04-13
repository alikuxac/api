import { InferSubjects, MongoAbility } from '@casl/ability';
import {
  RolePermission,
  RolePermissionGroup,
} from 'src/common/policy/constants/policy.enum.constant';

export type IPolicySubject = `${RolePermissionGroup}`;

export interface IPolicyRule {
  subject: IPolicySubject;
  action: RolePermission[];
}

export interface IPolicyRuleAbility {
  subject: IPolicySubject;
  action: RolePermission;
}

export type IPolicySubjectAbility = InferSubjects<IPolicySubject> | 'all';

export type IPolicyAbility = MongoAbility<
  [RolePermission, IPolicySubjectAbility]
>;

interface IPolicyHandler {
  handle(ability: IPolicyAbility): boolean;
}

type IPolicyHandlerCallback = (ability: IPolicyAbility) => boolean;

export type PolicyHandler = IPolicyHandler | IPolicyHandlerCallback;
