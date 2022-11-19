import { roleEvents } from './role';
import { guildMemberAddEvent } from './guildMemberAdd.event';

export const Events = [...roleEvents, guildMemberAddEvent];
