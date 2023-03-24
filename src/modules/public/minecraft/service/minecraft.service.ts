import { Injectable } from '@nestjs/common';
import * as mc from 'minecraft-server-util';

@Injectable()
export class MinecraftService {
  async javaStatus(host: string, port?: number, legacy?: boolean) {
    const realPort = port ? port : 25565;

    const response = legacy
      ? await mc.statusLegacy(host, realPort)
      : await mc.status(host, realPort);

    return {
      success: true,
      data: response,
    };
  }

  async peStatus(host: string, port?: number) {
    const realPort = port ? port : 19132;

    const response = await mc.statusBedrock(host, realPort);

    return {
      success: true,
      data: response,
    };
  }

  async query(host: string, port?: number, full?: boolean) {
    const realPort = port ? port : 19132;

    const response = full
      ? await mc.queryFull(host, realPort)
      : await mc.queryBasic(host, realPort);

    return {
      success: true,
      data: response,
    };
  }

  async parseAddress(address: string) {
    const defaultPort = 26565;

    const response = mc.parseAddress(address, defaultPort);

    return {
      success: true,
      data: response,
    };
  }
}
