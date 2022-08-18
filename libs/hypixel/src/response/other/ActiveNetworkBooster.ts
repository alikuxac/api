import { BaseResponse, FailedResponse, RateLimitResponse } from '../base';

export interface ActiveNetowrkBoosterSuccess extends BaseResponse {
  boosters: Array<BoosterAttributes>;
  boosterState: {
    decrementing: boolean;
  };
}

export interface BoosterAttributes {
  _id: string;
  purchaserUuid: string;
  amount: number;
  originalLength: number;
  length: number;
  gameType: number;
  dateActivated: number;
  stacked: Array<string>;
}

export type ActiveNetowrkBoosterForbidden = FailedResponse;
export type ActiveNetworkBoosterRateLimit = RateLimitResponse;
