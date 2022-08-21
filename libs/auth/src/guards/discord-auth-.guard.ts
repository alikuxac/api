import { AuthGuard } from '@nestjs/passport';

export class DiscordGuard extends AuthGuard('discord') {}
