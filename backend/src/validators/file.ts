import { z } from 'zod';

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || String(500 * 1024 * 1024), 10);

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
];

const DANGEROUS_PATTERNS = [
  /\.\./,
  /^\//,
  /\\/,
  /\x00/,
];

function sanitizeFilename(filename: string): string {
  let sanitized = filename
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '_')
    .replace(/\.{2,}/g, '.')
    .replace(/^\.+/, '')
    .replace(/\.+$/, '')
    .trim();

  if (!sanitized) {
    sanitized = 'unnamed_file';
  }

  if (sanitized.length > 255) {
    const ext = sanitized.split('.').pop() || '';
    const nameWithoutExt = sanitized.slice(0, sanitized.length - ext.length - 1);
    sanitized = nameWithoutExt.slice(0, 255 - ext.length - 1) + '.' + ext;
  }

  return sanitized;
}

function isPathTraversal(filename: string): boolean {
  return DANGEROUS_PATTERNS.some((pattern) => pattern.test(filename));
}

export function validateUploadedFile(
  file: Express.Multer.File | undefined,
  maxSize: number = MAX_FILE_SIZE
): { valid: true; sanitizedName: string } | { valid: false; statusCode: number; message: string } {
  if (!file) {
    return { valid: false, statusCode: 400, message: 'No file provided' };
  }

  if (file.size === 0) {
    return { valid: false, statusCode: 400, message: 'File is empty' };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      statusCode: 413,
      message: `File size exceeds maximum limit of ${Math.round(maxSize / (1024 * 1024))}MB`,
    };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return { valid: false, statusCode: 400, message: `File type '${file.mimetype}' is not supported` };
  }

  const originalName = file.originalname;
  if (!originalName || originalName.trim().length === 0) {
    return { valid: false, statusCode: 400, message: 'Invalid filename' };
  }

  if (isPathTraversal(originalName)) {
    return { valid: false, statusCode: 400, message: 'Invalid filename: path traversal detected' };
  }

  const sanitizedName = sanitizeFilename(originalName);

  return { valid: true, sanitizedName };
}

export { MAX_FILE_SIZE, ALLOWED_MIME_TYPES };
