import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ENUM_DOC_REQUEST_BODY_TYPE } from '@root/common/doc/constants/doc.enum.constant';
import {
  Doc,
  DocAuth,
  DocRequest,
  DocGuard,
  DocResponse,
  DocResponsePaging,
} from '@root/common/doc/decorators/doc.decorator';
import { ResponseIdSerialization } from 'src/common/response/serializations/response.id.serialization';
import {
  RoleDocParamsId,
  RoleDocQueryIsActive,
} from 'src/common/roles/constants/role.doc.constant';
import { RoleGetSerialization } from 'src/common/roles/serializations/role.get.serialization';
import { RoleListSerialization } from 'src/common/roles/serializations/role.list.serialization';

export function RoleListDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: 'modules.admin.role',
    }),
    DocRequest({
      queries: [...RoleDocQueryIsActive],
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponsePaging<RoleListSerialization>('role.list', {
      serialization: RoleListSerialization,
    }),
  );
}

export function RoleGetDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: 'modules.admin.role',
    }),
    DocRequest({
      params: RoleDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<RoleGetSerialization>('role.get', {
      serialization: RoleGetSerialization,
    }),
  );
}

export function RoleCreateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: 'modules.admin.role',
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocRequest({ bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON }),
    DocGuard({ role: true, policy: true }),
    DocResponse<ResponseIdSerialization>('role.create', {
      httpStatus: HttpStatus.CREATED,
      serialization: ResponseIdSerialization,
    }),
  );
}

export function RoleDeleteDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: 'modules.admin.role',
    }),
    DocRequest({
      params: RoleDocParamsId,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse('role.delete'),
  );
}

export function RoleUpdateDoc(): MethodDecorator {
  return applyDecorators(
    Doc({
      operation: 'modules.admin.role',
    }),
    DocRequest({
      params: RoleDocParamsId,
      bodyType: ENUM_DOC_REQUEST_BODY_TYPE.JSON,
    }),
    DocAuth({
      jwtAccessToken: true,
    }),
    DocGuard({ role: true, policy: true }),
    DocResponse<ResponseIdSerialization>('role.update', {
      serialization: ResponseIdSerialization,
    }),
  );
}
