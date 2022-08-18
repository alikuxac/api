export interface BaseResponse {
  success: boolean;
}

export interface FailedResponse extends BaseResponse {
  cause: string;
}

export interface RateLimitResponse extends FailedResponse {
  throttle: boolean;
  global: boolean;
}

export type ServiceUnavailableResponse = FailedResponse;
