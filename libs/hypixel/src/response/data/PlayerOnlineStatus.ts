import { BaseResponse, FailedResponse, RateLimitResponse } from '../base';

export interface PlayerOnlineStatusSuccess extends BaseResponse {
  uuid: string;
  session: {
    online: boolean;
    gameType: string;
    mode: string;
    map: string;
  };
}

export type PlayerOnlineStatusBadRequest = FailedResponse;
export type PlayerOnlineStatusFailed = FailedResponse;
export type PlayerOnlineStatusRateLimit = RateLimitResponse;
