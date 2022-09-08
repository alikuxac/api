import { IsString, IsNotEmpty } from 'class-validator';
export class CreateHypixelDto {}

export class uuidDto {
  @IsString()
  @IsNotEmpty()
  uuid: string;
}

export class guildDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  player: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
