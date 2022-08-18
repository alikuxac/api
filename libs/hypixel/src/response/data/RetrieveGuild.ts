import { BaseResponse, FailedResponse, RateLimitResponse } from '../base';

export interface RetrieveGuildSuccess extends BaseResponse {
  guild: Record<string, any>;
}

export type RetrieveGuildBadRequest = FailedResponse;
export type RetrieveGuildFailed = FailedResponse;
export type RetrieveGuildRateLimit = RateLimitResponse;
