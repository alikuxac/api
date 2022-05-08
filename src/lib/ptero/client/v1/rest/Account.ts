import type { EnableTwoFactor } from '../interface/Account';

export interface RESTEnableTwoFactorBody {
  code: string;
}

export type RESTEnableTwoFactorResult = EnableTwoFactor;

export interface RESTUpdateEmailBody {
  email: string;
  password: string;
}

export interface RESTUpdatePasswordBody {
  current_password: string;
  password: string;
  password_confirmation: string;
}
