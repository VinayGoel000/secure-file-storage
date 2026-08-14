import { FileItem, User, StorageInfo } from '@/types';

export const mockUser: User = {
  id: '1',
  email: 'alex.morgan@vaultly.io',
  name: 'Alex Morgan',
};

export const mockStorage: StorageInfo = {
  used: 2.4 * 1024 * 1024 * 1024,
  total: 10 * 1024 * 1024 * 1024,
};

export const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Portfolio.zip',
    type: 'file',
    mimeType: 'application/zip',
    size: 45.2 * 1024 * 1024,
    isPublic: false,
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z',
    ownerId: '1',
  },
  {
    id: '2',
    name: 'Q4 Report.pdf',
    type: 'file',
    mimeType: 'application/pdf',
    size: 2.8 * 1024 * 1024,
    isPublic: true,
    createdAt: '2025-01-14T14:20:00Z',
    updatedAt: '2025-01-14T14:20:00Z',
    shareToken: 'abc123',
    ownerId: '1',
  },
  {
    id: '3',
    name: 'Design Assets',
    type: 'folder',
    size: 0,
    isPublic: false,
    createdAt: '2025-01-10T09:15:00Z',
    updatedAt: '2025-01-12T16:45:00Z',
    ownerId: '1',
  },
  {
    id: '4',
    name: 'Resume.pdf',
    type: 'file',
    mimeType: 'application/pdf',
    size: 156 * 1024,
    isPublic: true,
    createdAt: '2025-01-08T11:00:00Z',
    updatedAt: '2025-01-08T11:00:00Z',
    shareToken: 'def456',
    ownerId: '1',
  },
  {
    id: '5',
    name: 'Project Notes.docx',
    type: 'file',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    size: 89 * 1024,
    isPublic: false,
    createdAt: '2025-01-05T08:30:00Z',
    updatedAt: '2025-01-06T12:15:00Z',
    ownerId: '1',
  },
  {
    id: '6',
    name: 'Budget 2025.xlsx',
    type: 'file',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 245 * 1024,
    isPublic: false,
    createdAt: '2025-01-03T15:45:00Z',
    updatedAt: '2025-01-04T09:20:00Z',
    ownerId: '1',
  },
];
