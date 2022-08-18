import { BaseResponse } from '../base';

export interface GameInformationSuccess extends BaseResponse {
  lastUpdated: number;
  games: Record<string, any>;
}

export interface SkillsSkyblockSuccess extends BaseResponse {
  lastUpdated: number;
  version: string;
  skills: Record<string, any>;
}
