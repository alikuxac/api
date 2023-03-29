import { guildEvent } from './guild';
import { roleEvents } from './role';
import { guildMemberAddEvent } from './guildMemberAdd.event';

export const Events = [...guildEvent, ...roleEvents, guildMemberAddEvent];
