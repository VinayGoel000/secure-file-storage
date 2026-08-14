import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

import { findUserByEmail, findUserById, createUser } from '../repositories/userRepository';
import { getJwtConfig } from '../config/jwt';
import { RegisterInput, LoginInput } from '../validators/auth';

const SALT_ROUNDS = 12;

export class AuthenticationError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 401) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = statusCode;
  }
}

export class ConflictError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 409) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = statusCode;
  }
}

export const registerUser = async (input: RegisterInput): Promise<Omit<User, 'passwordHash'>> => {
  const existingUser = await findUserByEmail(input.email);
  if (existingUser) {
    throw new ConflictError('A user with this email already exists');
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await createUser({
    email: input.email,
    passwordHash,
  });

  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const loginUser = async (input: LoginInput): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> => {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isPasswordValid) {
    throw new AuthenticationError('Invalid email or password');
  }

  const { secret, expiresIn } = getJwtConfig();
  const token = jwt.sign({ sub: user.id }, secret, { expiresIn } as jwt.SignOptions);

  const { passwordHash: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export const getUserFromToken = async (userId: string): Promise<Omit<User, 'passwordHash'>> => {
  const user = await findUserById(userId);
  if (!user) {
    throw new AuthenticationError('User not found');
  }

  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const parseTokenExpiry = (expiresIn: string): number => {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) {
    return 7 * 24 * 60 * 60 * 1000;
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 7 * 24 * 60 * 60 * 1000;
  }
};
