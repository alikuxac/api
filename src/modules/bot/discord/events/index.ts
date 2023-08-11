// import { guildEvent } from './guild';
// import { roleEvents } from './role';
import { guildMemberAddEvent } from './guildMemberAdd.event';

// Guild event
import { guildCreateEvent } from './guild/guildCreate.event';
import { guildDeleteEvent } from './guild/guildDelete.event';

import { roleUpdateEvent } from './role/roleUpdated.event';
import { roleDeleteEvent } from './role/roleDelete.event';

export const Events = [
  { provide: guildCreateEvent, useClass: guildCreateEvent },
  { provide: guildDeleteEvent, useClass: guildDeleteEvent },
  { provide: roleUpdateEvent, useClass: roleUpdateEvent },
  { provide: roleDeleteEvent, useClass: roleDeleteEvent },
  { provide: guildMemberAddEvent, useClass: guildMemberAddEvent },
];
