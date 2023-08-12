import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ResponseCustomHeadersInterceptor } from '../interceptors/response.custom-headers.interceptor';

export function ResponseCustomHeader() {
  return applyDecorators(UseInterceptors(ResponseCustomHeadersInterceptor));
}
