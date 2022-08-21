import { AuthGuard } from '@nestjs/passport';

export class JwtOrApiKeyGuard extends AuthGuard(['jwt', 'apikey']) {}
