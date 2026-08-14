import { Response, NextFunction } from 'express';
import fs from 'fs';

import { AuthenticatedRequest } from '../types';
import { validateUploadedFile } from '../validators/file';
import { generateStorageKey, uploadToS3, deleteFromS3, StorageError } from '../services/storageService';
import { createFile, CreateFileData } from '../repositories/fileRepository';

export const uploadFile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const filePath = req.file?.path;

  try {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        statusCode: 401,
        message: 'Authentication required',
      });
      return;
    }

    const validation = validateUploadedFile(req.file);
    if (!validation.valid) {
      if (filePath) {
        fs.unlink(filePath, () => {});
      }
      res.status(validation.statusCode).json({
        status: 'error',
        statusCode: validation.statusCode,
        message: validation.message,
      });
      return;
    }

    const storageKey = generateStorageKey(req.user.id);

    try {
      await uploadToS3(filePath!, storageKey, req.file!.mimetype);
    } catch (error) {
      if (filePath) {
        fs.unlink(filePath, () => {});
      }
      if (error instanceof StorageError) {
        res.status(error.statusCode).json({
          status: 'error',
          statusCode: error.statusCode,
          message: error.message,
        });
        return;
      }
      res.status(502).json({
        status: 'error',
        statusCode: 502,
        message: 'Failed to upload file to storage',
      });
      return;
    }

    try {
      const fileData: CreateFileData = {
        ownerId: req.user.id,
        originalName: validation.sanitizedName,
        storageKey,
        mimeType: req.file!.mimetype,
        size: BigInt(req.file!.size),
      };

      const file = await createFile(fileData);

      if (filePath) {
        fs.unlink(filePath, () => {});
      }

      res.status(201).json({
        status: 'ok',
        data: {
          file: {
            id: file.id,
            originalName: file.originalName,
            mimeType: file.mimeType,
            size: Number(file.size),
            isPublic: file.isPublic,
            createdAt: file.createdAt.toISOString(),
          },
        },
      });
    } catch (dbError) {
      console.error('[File] Database error, cleaning up S3 object:', dbError);
      await deleteFromS3(storageKey).catch((cleanupError) => {
        console.error('[File] Failed to clean up S3 object:', cleanupError);
      });

      if (filePath) {
        fs.unlink(filePath, () => {});
      }

      res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Failed to save file metadata',
      });
    }
  } catch (error) {
    if (filePath) {
      fs.unlink(filePath, () => {});
    }
    next(error);
  }
};
