import type { ApiKey } from '../interface/ApiKey';

export interface RESTCreateApiKeyBody {
  description: string;
  allowed_ips: string[];
}

export type RESTCreateApiKeyResult = ApiKey;
