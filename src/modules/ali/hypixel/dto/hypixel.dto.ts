import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class uuidDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The username to get the UUID of', type: String })
  uuid: string;
}

export class guildDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The guild to get the info of', type: String })
  id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'The player to get the guild of', type: String })
  player: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The player name to get the guild of',
    type: String,
  })
  name: string;
}
