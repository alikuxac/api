import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import { DateTime } from 'luxon';

@Injectable()
export class FunService {
  constructor(private readonly i18nService: I18nService) {}

  getAge(date: string) {
    const birthDate = DateTime.fromISO(date);

    const diff = birthDate.diffNow(['year'], {
      conversionAccuracy: 'casual',
    });
    const message = this.i18nService.t('fun.get_age', {
      args: { year: diff },
    });
    return {
      success: true,
      message,
    };
  }

  yearProcess() {
    const today = DateTime.now();
    const start = DateTime.fromISO(`${today.year}-01-01`);
    const end = DateTime.fromISO(`${today.year + 1}-01-01`);
    const percent =
      (Math.abs(today.diff(start, 'millisecond').milliseconds) /
        Math.abs(end.diff(start, 'millisecond').milliseconds)) *
      100;
    return `The year ${today.year} is ${percent} complete!`;
  }
}
