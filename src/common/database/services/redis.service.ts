import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType, createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: RedisClientType;
  private isConnected = false;
  private logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      url: this.configService.get('REDIS_URL'),
    });
  }

  onModuleInit() {
    this.clientListener();
    this.connect();
  }

  private clientListener() {
    this.client.on('connect', () => this.logger.log('Redis is connecting'));

    this.client.on('ready', () => {
      this.isConnected = true;
      this.logger.log('Redis connected');
    });

    this.client.on('end', () => {
      this.isConnected = false;
      this.logger.log('Redis disconnected');
    });

    this.client.on('error', (err) => {
      this.isConnected = false;
      this.logger.error(err);
    });

    this.client.on('reconnecting', () => {
      this.isConnected = false;
      this.logger.log('Redis is reconnecting');
    });
  }

  async connect() {
    await this.client.connect();
  }

  private assertHasConnected() {
    if (!this.isConnected) {
      throw new InternalServerErrorException(
        'A connection to Redis has not been established',
      );
    }
  }

  async get(key: string) {
    this.assertHasConnected();

    return await this.client.get(key);
  }

  async set(key: string, value: string, ex?: number) {
    this.assertHasConnected();

    return ex
      ? await this.client.setEx(key, ex, value)
      : await this.client.set(key, value);
  }

  async del(key: string) {
    this.assertHasConnected();

    return await this.client.del(key);
  }
}
