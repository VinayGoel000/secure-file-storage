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
  name?: string;
  avatarUrl?: string;
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
  status: 'pending' | 'uploading' | 'paused' | 'completed' | 'error';
  error?: string;
}
