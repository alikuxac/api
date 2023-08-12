import {
  applyDecorators,
  SetMetadata,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ERROR_CLASS_META_KEY,
  ERROR_FUNCTION_META_KEY,
} from 'src/common/error/constants/error.constant';
import { ErrorGuard } from '../guards/error.guard';
import { ErrorFilter } from '../filters/error.filter';

export function ErrorMeta(cls: string, func: string): MethodDecorator {
  return applyDecorators(
    SetMetadata(ERROR_CLASS_META_KEY, cls),
    SetMetadata(ERROR_FUNCTION_META_KEY, func),
  );
}

export function Error() {
  return applyDecorators(UseGuards(ErrorGuard), UseFilters(ErrorFilter));
}
