import { Injectable } from '@nestjs/common';

import { DateTime } from 'luxon';

@Injectable()
export class FunService {
  getAge(date: string) {
    const birthDate = DateTime.fromISO(date);

    const diff = birthDate.diffNow(['year'], {
      conversionAccuracy: 'casual',
    });
    return {
      success: true,
      message: `Một ai đó sinh vào năm ${birthDate.year}, hiện tại được ${diff.years} tuổi rồi.`,
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
