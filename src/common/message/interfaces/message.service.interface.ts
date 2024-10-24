import { ValidationError } from 'class-validator';
import {
  IMessageErrorOptions,
  IMessageSetOptions,
  IMessageValidationError,
  IMessageValidationImportError,
  IMessageValidationImportErrorParam,
} from 'src/common/message/interfaces/message.interface';

export interface IMessageService {
  getAvailableLanguages(): string[];
  getLanguage(): string;
  filterLanguage(customLanguage: string): string[];
  setMessage(path: string, options?: IMessageSetOptions): string;
  setValidationMessage(
    errors: ValidationError[],
    options?: IMessageErrorOptions,
  ): IMessageValidationError[];
  setValidationImportMessage(
    errors: IMessageValidationImportErrorParam[],
    options?: IMessageErrorOptions,
  ): IMessageValidationImportError[];
}
