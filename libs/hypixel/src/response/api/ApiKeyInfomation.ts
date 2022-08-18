import { BaseResponse, FailedResponse, RateLimitResponse } from '../base';

export interface ApiKeyInfomationSuccess extends BaseResponse {
  record: RecordAtribute;
}

export interface RecordAtribute {
  key: string;
  owner: string;
  limit: number;
  queriesInPastMin: number;
  totalQueries: number;
}

export type ApiKeyInfomationFailed = FailedResponse;
export type ApiKeyInfomationRateLimit = RateLimitResponse;
