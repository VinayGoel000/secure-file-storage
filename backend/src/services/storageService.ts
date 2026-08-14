import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

export class StorageError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'StorageError';
    this.statusCode = statusCode;
  }
}

function getS3Client(): S3Client {
  return new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  });
}

function getBucketName(): string {
  const bucket = process.env.AWS_S3_BUCKET_NAME;
  if (!bucket) {
    throw new StorageError('AWS_S3_BUCKET_NAME environment variable is required');
  }
  return bucket;
}

export function generateStorageKey(userId: string): string {
  const uniqueId = uuidv4();
  return `users/${userId}/${uniqueId}`;
}

export async function uploadToS3(
  filePath: string,
  storageKey: string,
  mimeType: string
): Promise<void> {
  const s3Client = getS3Client();
  const bucket = getBucketName();

  const fileStream = fs.createReadStream(filePath);

  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: bucket,
      Key: storageKey,
      Body: fileStream,
      ContentType: mimeType,
    },
  });

  try {
    await upload.done();
  } catch (error) {
    console.error('[S3] Upload failed:', error);
    throw new StorageError('Failed to upload file to storage');
  }
}

export async function deleteFromS3(storageKey: string): Promise<void> {
  const s3Client = getS3Client();
  const bucket = getBucketName();

  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: storageKey,
      })
    );
  } catch (error) {
    console.error('[S3] Delete failed:', error);
    throw new StorageError('Failed to delete file from storage');
  }
}
