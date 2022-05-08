export interface TwoFactorDetails {
  data: {
    image_url_data: string;
  };
}

export interface Tokens {
  tokens: string[];
}

export interface EnableTwoFactor {
  object: 'recovery_tokens';
  attributes: Tokens;
}
