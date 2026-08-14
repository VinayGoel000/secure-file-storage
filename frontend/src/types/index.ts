export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  mimeType?: string;
  size: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  shareToken?: string;
  ownerId: string;
}

export interface User {
  id: string;
  email: string;
}

export interface StorageInfo {
  used: number;
  total: number;
}

export type FileType = 'pdf' | 'zip' | 'image' | 'document' | 'spreadsheet' | 'folder' | 'other';

export interface UploadItem {
  id: string;
  file: File;
  name: string;
  size: number;
  progress: number;
  status: 'pending' | 'uploading' | 'paused' | 'completed' | 'error' | 'validating';
  error?: string;
  validationError?: string;
}

export type SharePageState = 'loading' | 'found' | 'not-found' | 'expired' | 'error';

export interface ShareData {
  fileName: string;
  fileType: string;
  fileSize: number;
  mimeType: string;
  sharedBy: string;
  sharedAt: string;
  isPublic: boolean;
}

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'text/plain',
  'text/csv',
];
