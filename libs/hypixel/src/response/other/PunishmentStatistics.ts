import {
  BaseResponse,
  FailedResponse,
  RateLimitResponse,
  ServiceUnavailableResponse,
} from '../base';

export interface PunishmentStatisticsSuccess extends BaseResponse {
  watchdog_lastMinute: number;
  staff_rollingDaily: number;
  watchdog_total: number;
  watchdog_rollingDaily: number;
  staff_total: number;
}

export type PunishmentStatisticsFailed = FailedResponse;
export type PunishmentStatisticsRateLimit = RateLimitResponse;
export type PunishmentStatisticsServiceUnavailable = ServiceUnavailableResponse;
