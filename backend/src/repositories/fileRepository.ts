import { PrismaClient, File } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateFileData {
  ownerId: string;
  originalName: string;
  storageKey: string;
  mimeType: string;
  size: bigint;
}

export const createFile = async (data: CreateFileData): Promise<File> => {
  return prisma.file.create({
    data: {
      ownerId: data.ownerId,
      originalName: data.originalName,
      storageKey: data.storageKey,
      mimeType: data.mimeType,
      size: data.size,
      isPublic: false,
      shareToken: null,
    },
  });
};

export const findFileById = async (id: string): Promise<File | null> => {
  return prisma.file.findUnique({
    where: { id },
  });
};

export const findFilesByOwner = async (ownerId: string): Promise<File[]> => {
  return prisma.file.findMany({
    where: { ownerId },
    orderBy: { createdAt: 'desc' },
  });
};

export const deleteFile = async (id: string): Promise<File | null> => {
  return prisma.file.delete({
    where: { id },
  });
};
