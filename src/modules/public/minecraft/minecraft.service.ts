import { Injectable } from '@nestjs/common';
import * as mc from 'minecraft-server-util';
import { RedisService } from '@shared/redis/redis.service';

@Injectable()
export class MinecraftService {
  constructor(private readonly redisService: RedisService) {}
  async javaStatus(host: string, port?: number, legacy = false) {
    const realPort = port ? port : 25565;
    const javaStatusKey = `mc_javaStatus:${host}:${realPort}:${legacy}`;
    const cachedStatus = await this.redisService.get(javaStatusKey);
    if (cachedStatus) {
      return JSON.parse(cachedStatus) as
        | mc.JavaStatusLegacyResponse
        | mc.JavaStatusResponse;
    }
    const response = legacy
      ? await mc.statusLegacy(host, realPort)
      : await mc.status(host, realPort);
    await this.redisService.set(javaStatusKey, JSON.stringify(response), 60);
    return response;
  }

  async peStatus(host: string, port?: number) {
    const realPort = port ? port : 19132;
    const peStatusKey = `mc_peStatus:${host}:${realPort}`;
    const cachedStatus = await this.redisService.get(peStatusKey);
    if (cachedStatus) {
      return JSON.parse(cachedStatus) as mc.BedrockStatusResponse;
    }
    const response = await mc.statusBedrock(host, realPort);
    await this.redisService.set(peStatusKey, JSON.stringify(response), 300);
    return response;
  }

  async query(host: string, port?: number, full?: boolean) {
    const realPort = port ? port : 19132;
    const queryKey = `mc_query:${host}:${realPort}:${full}`;
    const cachedQuery = await this.redisService.get(queryKey);
    if (cachedQuery) {
      return JSON.parse(cachedQuery) as
        | mc.BasicQueryResponse
        | mc.FullQueryResponse;
    }
    const response = full
      ? await mc.queryFull(host, realPort)
      : await mc.queryBasic(host, realPort);
    await this.redisService.set(queryKey, JSON.stringify(response), 300);
    return response;
  }

  async parseAddress(address: string) {
    const defaultPort = 26565;
    const parseAddressKey = `mc_parseAddress:${address}`;
    const cachedAddress = await this.redisService.get(parseAddressKey);
    if (cachedAddress) {
      return JSON.parse(cachedAddress) as mc.ParsedAddress;
    }
    const response = mc.parseAddress(address, defaultPort);
    await this.redisService.set(parseAddressKey, JSON.stringify(response), 300);
    return response;
  }
}
