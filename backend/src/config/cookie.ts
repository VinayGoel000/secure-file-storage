import { CookieOptions } from 'express';

export const ACCESS_TOKEN_COOKIE = 'access_token';

export const getCookieOptions = (expiresInMs: number): CookieOptions => {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    maxAge: expiresInMs,
    path: '/',
  };
};
