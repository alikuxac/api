import { Injectable } from '@nestjs/common';
import * as mc from 'minecraft-server-util';

@Injectable()
export class MinecraftService {
  async javaStatus(host: string, port?: number, legacy?: boolean) {
    const realPort = port ? port : 25565;
    return legacy
      ? await mc.statusLegacy(host, realPort)
      : await mc.status(host, realPort);
  }

  async peStatus(host: string, port?: number) {
    const realPort = port ? port : 19132;
    return await mc.statusBedrock(host, realPort);
  }

  async query(host: string, port?: number, full?: boolean) {
    const realPort = port ? port : 19132;
    return full
      ? await mc.queryFull(host, realPort)
      : await mc.queryBasic(host, realPort);
  }

  async parseAddress(address: string) {
    const defaultPort = 26565;
    return mc.parseAddress(address, defaultPort);
  }
}
