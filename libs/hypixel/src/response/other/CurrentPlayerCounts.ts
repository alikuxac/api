import { BaseResponse, FailedResponse, RateLimitResponse } from '../base';

export interface CurrentPlayerCountsSuccess extends BaseResponse {
  playerCount: number;
}

export type CurrentPlayerCountsFailed = FailedResponse;
export type CurrentPlayerCountsRateLimit = RateLimitResponse;
