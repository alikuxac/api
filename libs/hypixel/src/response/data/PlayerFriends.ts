import { BaseResponse, FailedResponse, RateLimitResponse } from '../base';

export interface PlayerFriendsSuccess extends BaseResponse {
  uuid: string;
  records: Array<PlayerFriendsAtrribute>;
}

export interface PlayerFriendsAtrribute {
  _id: string;
  uuidSender: string;
  uuidReceiver: string;
  started: number;
}

export type PlayerFriendsBadRequest = FailedResponse;
export type PlayerFriendsUnprocessableEntity = FailedResponse;
export type PlayerFriendsFailed = FailedResponse;
export type PlayerFriendsRateLimit = RateLimitResponse;
