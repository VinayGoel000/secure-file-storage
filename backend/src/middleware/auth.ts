import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { validate as uuidValidate } from 'uuid';

import { AuthenticatedRequest } from '../types';
import { getJwtConfig } from '../config/jwt';
import { ACCESS_TOKEN_COOKIE } from '../config/cookie';

interface JwtPayload {
  sub: string;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies[ACCESS_TOKEN_COOKIE];

  if (!token) {
    res.status(401).json({
      status: 'error',
      statusCode: 401,
      message: 'Authentication required',
    });
    return;
  }

  try {
    const { secret } = getJwtConfig();
    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (!decoded.sub || !uuidValidate(decoded.sub)) {
      res.status(401).json({
        status: 'error',
        statusCode: 401,
        message: 'Invalid authentication token',
      });
      return;
    }

    req.user = { id: decoded.sub, email: '' };
    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      statusCode: 401,
      message: 'Invalid or expired authentication token',
    });
  }
};
