import bcrypt from 'bcryptjs';

export function cast<T>(value: unknown): T {
  return value as T;
}

export function comparePassword(
  password: string,
  passwordHash: string,
): boolean {
  return bcrypt.compareSync(password, passwordHash);
}
