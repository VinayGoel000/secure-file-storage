import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const createUser = async (data: {
  email: string;
  passwordHash: string;
}): Promise<User> => {
  return prisma.user.create({
    data,
  });
};
