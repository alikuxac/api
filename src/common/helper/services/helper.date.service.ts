import { Injectable } from '@nestjs/common';
import { DateTime } from 'luxon';
import {
  ENUM_HELPER_DATE_DIFF,
  ENUM_HELPER_DATE_FORMAT,
} from 'src/common/helper/constants/helper.enum.constant';
import {
  IHelperDateExtractDate,
  IHelperDateOptionsBackward,
  IHelperDateOptionsCreate,
  IHelperDateOptionsDiff,
  IHelperDateOptionsFormat,
  IHelperDateOptionsForward,
  IHelperDateOptionsRoundDown,
  IHelperDateStartAndEnd,
  IHelperDateStartAndEndDate,
} from 'src/common/helper/interfaces/helper.interface';

@Injectable()
export class HelperDateService {
  calculateAge(dateOfBirth: Date): number {
    const dateTimeOfBirth = DateTime.fromJSDate(dateOfBirth);
    return DateTime.now().diff(dateTimeOfBirth).years;
  }

  diff(
    dateOne: Date,
    dateTwoMoreThanDateOne: Date,
    options?: IHelperDateOptionsDiff,
  ): number {
    const mDateOne = DateTime.fromJSDate(dateOne);
    const mDateTwo = DateTime.fromJSDate(dateTwoMoreThanDateOne);
    const diff = mDateOne.diff(mDateTwo);

    if (options?.format === ENUM_HELPER_DATE_DIFF.MILIS) {
      return diff.milliseconds;
    } else if (options?.format === ENUM_HELPER_DATE_DIFF.SECONDS) {
      return diff.seconds;
    } else if (options?.format === ENUM_HELPER_DATE_DIFF.HOURS) {
      return diff.hours;
    } else if (options?.format === ENUM_HELPER_DATE_DIFF.MINUTES) {
      return diff.minutes;
    } else {
      return diff.days;
    }
  }

  check(date: string | Date | number): boolean {
    switch (typeof date) {
      case 'string':
        return DateTime.fromISO(date).isValid;
      case 'number':
        return DateTime.fromMillis(date).isValid;
      default:
        return DateTime.fromJSDate(date).isValid;
    }
  }

  checkTimestamp(timestamp: number): boolean {
    return DateTime.fromMillis(timestamp).isValid;
  }

  create(
    date?: string | number | Date,
    options?: IHelperDateOptionsCreate,
  ): Date {
    let mDate: DateTime;

    if (date) {
      switch (typeof date) {
        case 'string':
          mDate = DateTime.fromISO(date);
        case 'number':
          mDate = DateTime.fromMillis(Number(date));
        default:
          mDate = DateTime.fromJSDate(date as Date);
      }
    } else {
      mDate = DateTime.now();
    }

    if (options?.startOfDay) {
      mDate.startOf('day');
    }

    return mDate.toJSDate();
  }

  timestamp(
    date?: string | Date | number,
    options?: IHelperDateOptionsCreate,
  ): number {
    let mDate: DateTime;

    if (date) {
      switch (typeof date) {
        case 'string':
          mDate = DateTime.fromISO(date);
        case 'number':
          mDate = DateTime.fromMillis(Number(date));
        default:
          mDate = DateTime.fromJSDate(date as Date);
      }
    } else {
      mDate = DateTime.now();
    }

    if (options?.startOfDay) {
      mDate.startOf('day');
    }

    return mDate.valueOf();
  }

  format(date: Date, options?: IHelperDateOptionsFormat): string {
    return DateTime.fromJSDate(date).toFormat(
      options?.format ?? ENUM_HELPER_DATE_FORMAT.DATE,
    );
  }

  forwardInMilliseconds(
    milliseconds: number,
    options?: IHelperDateOptionsForward,
  ): Date {
    return options?.fromDate
      ? DateTime.fromJSDate(options.fromDate)
          .plus({ millisecond: milliseconds })
          .toJSDate()
      : DateTime.now().plus({ millisecond: milliseconds }).toJSDate();
  }

  backwardInMilliseconds(
    milliseconds: number,
    options?: IHelperDateOptionsBackward,
  ): Date {
    return options?.fromDate
      ? DateTime.fromJSDate(options.fromDate)
          .minus({ millisecond: milliseconds })
          .toJSDate()
      : DateTime.now().minus({ millisecond: milliseconds }).toJSDate();
  }

  forwardInSeconds(seconds: number, options?: IHelperDateOptionsForward): Date {
    return options?.fromDate
      ? DateTime.fromJSDate(options.fromDate)
          .plus({ second: seconds })
          .toJSDate()
      : DateTime.now().plus({ second: seconds }).toJSDate();
  }

  backwardInSeconds(
    seconds: number,
    options?: IHelperDateOptionsBackward,
  ): Date {
    return options?.fromDate
      ? DateTime.fromJSDate(options.fromDate)
          .minus({ second: seconds })
          .toJSDate()
      : DateTime.now().minus({ second: seconds }).toJSDate();
  }

  forwardInMinutes(minutes: number, options?: IHelperDateOptionsForward): Date {
    return options?.fromDate
      ? DateTime.fromJSDate(options.fromDate)
          .plus({ minute: minutes })
          .toJSDate()
      : DateTime.now().plus({ minute: minutes }).toJSDate();
  }

  backwardInMinutes(
    minutes: number,
    options?: IHelperDateOptionsBackward,
  ): Date {
    return options?.fromDate
      ? DateTime.fromJSDate(options.fromDate)
          .minus({ minute: minutes })
          .toJSDate()
      : DateTime.now().minus({ minute: minutes }).toJSDate();
  }

  forwardInHours(hours: number, options?: IHelperDateOptionsForward): Date {
    return options?.fromDate
      ? DateTime.fromJSDate(options.fromDate).plus({ hour: hours }).toJSDate()
      : DateTime.now().plus({ hour: hours }).toJSDate();
  }

  backwardInHours(hours: number, options?: IHelperDateOptionsBackward): Date {
    return options?.fromDate
      ? DateTime.fromJSDate(options.fromDate).minus({ hour: hours }).toJSDate()
      : DateTime.now().minus({ hour: hours }).toJSDate();
  }

  forwardInDays(days: number, options?: IHelperDateOptionsForward): Date {
    return options?.fromDate
      ? DateTime.fromJSDate(options.fromDate).plus({ day: days }).toJSDate()
      : DateTime.now().plus({ day: days }).toJSDate();
  }

  backwardInDays(days: number, options?: IHelperDateOptionsBackward): Date {
    return options?.fromDate
      ? DateTime.fromJSDate(options.fromDate).minus({ day: days }).toJSDate()
      : DateTime.now().minus({ day: days }).toJSDate();
  }

  forwardInMonths(months: number, options?: IHelperDateOptionsForward): Date {
    return options?.fromDate
      ? DateTime.fromJSDate(options.fromDate).plus({ month: months }).toJSDate()
      : DateTime.now().plus({ month: months }).toJSDate();
  }

  backwardInMonths(months: number, options?: IHelperDateOptionsBackward): Date {
    return options?.fromDate
      ? DateTime.fromJSDate(options.fromDate)
          .minus({ month: months })
          .toJSDate()
      : DateTime.now().minus({ month: months }).toJSDate();
  }

  endOfMonth(date?: Date): Date {
    return DateTime.fromJSDate(date).endOf('month').toJSDate();
  }

  startOfMonth(date?: Date): Date {
    return DateTime.fromJSDate(date).startOf('month').toJSDate();
  }

  endOfYear(date?: Date): Date {
    return DateTime.fromJSDate(date).endOf('year').toJSDate();
  }

  startOfYear(date?: Date): Date {
    return date
      ? DateTime.fromJSDate(date).startOf('year').toJSDate()
      : DateTime.now().startOf('year').toJSDate();
  }

  endOfDay(date?: Date): Date {
    return date
      ? DateTime.fromJSDate(date).endOf('day').toJSDate()
      : DateTime.now().endOf('day').toJSDate();
  }

  startOfDay(date?: Date): Date {
    return date
      ? DateTime.fromJSDate(date).startOf('day').toJSDate()
      : DateTime.now().startOf('day').toJSDate();
  }

  extractDate(date: string | Date | number): IHelperDateExtractDate {
    const newDate = this.create(date);
    const day: string = this.format(newDate, {
      format: ENUM_HELPER_DATE_FORMAT.ONLY_DATE,
    });
    const month: string = this.format(newDate, {
      format: ENUM_HELPER_DATE_FORMAT.ONLY_MONTH,
    });
    const year: string = this.format(newDate, {
      format: ENUM_HELPER_DATE_FORMAT.ONLY_YEAR,
    });

    return {
      date: newDate,
      day,
      month,
      year,
    };
  }

  roundDown(date: Date, options?: IHelperDateOptionsRoundDown): Date {
    const mDate = DateTime.fromJSDate(date).set({ millisecond: 0 });

    if (options?.hour) {
      mDate.set({ hour: 0 });
    }

    if (options?.minute) {
      mDate.set({ minute: 0 });
    }

    if (options?.second) {
      mDate.set({ second: 0 });
    }

    return mDate.toJSDate();
  }

  getStartAndEndDate(
    options?: IHelperDateStartAndEnd,
  ): IHelperDateStartAndEndDate {
    const today = DateTime.now();
    const todayMonth = today.toFormat(ENUM_HELPER_DATE_FORMAT.ONLY_MONTH);
    const todayYear = today.toFormat(ENUM_HELPER_DATE_FORMAT.ONLY_YEAR);
    // set month and year
    const year = options?.year ?? todayYear;
    const month = options?.month ?? todayMonth;

    const date = DateTime.fromFormat(`${year}-${month}-02`, 'YYYY-MM-DD');
    let startDate: Date = date.startOf('year').toJSDate();
    let endDate: Date = date.endOf('year').toJSDate();

    if (options?.month) {
      const date = DateTime.fromFormat(`${year}-${month}-02`, 'YYYY-MM-DD');
      startDate = date.startOf('month').toJSDate();
      endDate = date.endOf('month').toJSDate();
    }

    return {
      startDate,
      endDate,
    };
  }
}
