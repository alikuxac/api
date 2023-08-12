export enum ENUM_USER_STATUS_CODE_ERROR {
  USER_NOT_FOUND_ERROR = 5200,
  USER_USERNAME_EXISTS_ERROR = 5201,
  USER_EMAIL_EXIST_ERROR = 5202,
  USER_MOBILE_NUMBER_EXIST_ERROR = 5203,
  USER_IS_ACTIVE_ERROR = 5204,
  USER_INACTIVE_ERROR = 5205,
  USER_INACTIVE_PERMANENT_ERROR = 5206,
  USER_PASSWORD_NOT_MATCH_ERROR = 5207,
  USER_PASSWORD_NEW_MUST_DIFFERENCE_ERROR = 5208,
  USER_PASSWORD_EXPIRED_ERROR = 5209,
  USER_PASSWORD_ATTEMPT_MAX_ERROR = 5210,
  USER_BLOCKED_ERROR = 5211,
}

export enum ENUM_USER_STATUS_CODE_SUCCESS {
  USER_PASSWORD_EXPIRED_ERROR = 1000,
}
