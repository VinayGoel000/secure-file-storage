import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

import { AuthenticatedRequest } from '../types';
import { registerSchema, loginSchema } from '../validators/auth';
import {
  registerUser,
  loginUser,
  getUserFromToken,
  parseTokenExpiry,
  AuthenticationError,
  ConflictError,
} from '../services/authService';
import { ACCESS_TOKEN_COOKIE, getCookieOptions } from '../config/cookie';
import { getJwtConfig } from '../config/jwt';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const input = registerSchema.parse(req.body);
    const user = await registerUser(input);
    res.status(201).json({
      status: 'ok',
      data: { user },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Validation failed',
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
      return;
    }
    if (error instanceof ConflictError) {
      res.status(error.statusCode).json({
        status: 'error',
        statusCode: error.statusCode,
        message: error.message,
      });
      return;
    }
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const input = loginSchema.parse(req.body);
    const { user, token } = await loginUser(input);

    const { expiresIn } = getJwtConfig();
    const maxAge = parseTokenExpiry(expiresIn);
    const cookieOptions = getCookieOptions(maxAge);

    res.cookie(ACCESS_TOKEN_COOKIE, token, cookieOptions);
    res.status(200).json({
      status: 'ok',
      data: { user },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        status: 'error',
        statusCode: 400,
        message: 'Validation failed',
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
      return;
    }
    if (error instanceof AuthenticationError) {
      res.status(error.statusCode).json({
        status: 'error',
        statusCode: error.statusCode,
        message: error.message,
      });
      return;
    }
    next(error);
  }
};

export const me = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        statusCode: 401,
        message: 'Authentication required',
      });
      return;
    }

    const user = await getUserFromToken(req.user.id);
    res.status(200).json({
      status: 'ok',
      data: { user },
    });
  } catch (error) {
    if (error instanceof AuthenticationError) {
      res.status(error.statusCode).json({
        status: 'error',
        statusCode: error.statusCode,
        message: error.message,
      });
      return;
    }
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cookieOptions = getCookieOptions(0);
    res.clearCookie(ACCESS_TOKEN_COOKIE, cookieOptions);
    res.status(200).json({
      status: 'ok',
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};
