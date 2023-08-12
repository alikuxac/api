import { faker } from '@faker-js/faker';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';
import { RoleUpdateDto } from 'src/common/roles/dto/role.update.dto';
import {
  RolePermission,
  RolePermissionGroup,
} from 'src/common/policy/constants/policy.enum.constant';

class RolePermissionDto {
  @ApiProperty({
    required: true,
    description: 'Permission subject',
    enum: RolePermissionGroup,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(RolePermissionGroup)
  subject: RolePermissionGroup;

  @ApiProperty({
    required: true,
    description: 'Permission action base on subject',
    isArray: true,
    enum: RolePermission,
    default: Object.values(RolePermission),
  })
  @IsString({ each: true })
  @IsEnum(RolePermission, { each: true })
  @IsArray()
  @IsNotEmpty()
  @ArrayNotEmpty()
  action: RolePermission[];
}

export class RoleCreateDto extends PartialType(RoleUpdateDto) {
  @ApiProperty({
    description: 'Name of the role',
    example: faker.person.jobType(),
    required: true,
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  readonly name: string;

  @ApiProperty({
    description: 'Description of the role',
    required: false,
    default: '',
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    type: () => RolePermissionDto,
    required: true,
    nullable: false,
    default: [],
  })
  @IsNotEmpty()
  @IsArray()
  @Type(() => RolePermissionDto)
  readonly permissions: RolePermissionDto[];
}
