import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { HelperDateService } from 'src/common/helper/services/helper.date.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class MaxDateTodayConstraint implements ValidatorConstraintInterface {
  constructor(private readonly helperDateService: HelperDateService) {}

  validate(value: string): boolean {
    const todayDate = this.helperDateService.endOfDay();
    const valueDate = this.helperDateService.startOfDay(
      this.helperDateService.create(value),
    );
    return valueDate <= todayDate;
  }
}

export function MaxDateToday(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): any {
    registerDecorator({
      name: 'MaxDateToday',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: MaxDateTodayConstraint,
    });
  };
}
