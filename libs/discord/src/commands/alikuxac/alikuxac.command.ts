import { Command, UseGroup } from '@discord-nestjs/core';

import {
  AddStickRoleCommand,
  RemoveStickRoleCommand,
  checkStickRoleCommand,
} from './stickrole';

@Command({
  name: 'alikuxac',
  description: 'Alikuxac',
  include: [
    UseGroup(
      { name: 'stickRole', description: 'Stick Role' },
      AddStickRoleCommand,
      RemoveStickRoleCommand,
      checkStickRoleCommand,
    ),
  ],
})
export class AlikuxacCommand {}
