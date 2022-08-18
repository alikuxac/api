import { BaseResponse, FailedResponse, RateLimitResponse } from '../base';

export interface RecentGamesSuccess extends BaseResponse {
  uuid: string;
  games: Array<RecentGamesAtrribute>;
}

export interface RecentGamesAtrribute {
  date: number;
  gameType: string;
  mode: string;
  map: string;
  ended: number;
}

export type RecentGamesBadRequest = FailedResponse;
export type RecentGamesUnprocessableEntity = FailedResponse;
export type RecentGamesFailed = FailedResponse;
export type RecentGamesRateLimit = RateLimitResponse;
