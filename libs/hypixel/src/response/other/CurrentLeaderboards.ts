import {
  BaseResponse,
  FailedResponse,
  RateLimitResponse,
  ServiceUnavailableResponse,
} from '../base';

export interface CurrentLeaderboardsSuccess extends BaseResponse {
  leaderboars: Record<string, any>;
}

export type CurrentLeaderboardsFailed = FailedResponse;
export type CurrentLeaderboardsRateLimit = RateLimitResponse;
export type CurrentLeaderboardsServiceUnavailable = ServiceUnavailableResponse;
