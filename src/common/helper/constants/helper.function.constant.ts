import ms from 'ms';

export function seconds(msValue: string): number {
  return ms(msValue) / 1000;
}

export function cast<T>(value: unknown): T {
  return value as T;
}
