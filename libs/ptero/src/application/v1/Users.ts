export interface UserAttributes {
  id: number;
  external_id: string;
  uuid: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  language: string;
  root_admin: boolean;
  '2fa': boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserData {
  object: 'user';
  attributes: UserAttributes;
}

export interface Users {
  object: 'list';
  data: UserData[];
}
