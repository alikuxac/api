import { BaseResponse, FailedResponse, RateLimitResponse } from '../base';

export interface SpecificPlayerSuccess extends BaseResponse {
  player: PlayerAtrribute;
}

export interface PlayerAtrribute {
  uuid: string;
  displayName: string;
  rank: string;
  packageRank: string;
  newPackageRank: string;
  monthlyPackageRank: string;
  firstLogin: number;
  lastLogin: number;
  lastLogout: number;
  stats: Record<string, any>;
}

export type SpecificPlayerBadRequest = FailedResponse;
export type SpecificPlayerFailed = FailedResponse;
export type SpecificPlayerRateLimit = RateLimitResponse;
