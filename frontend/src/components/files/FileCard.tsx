'use client';

import { FileItem } from '@/types';
import FileTypeIcon, { getFileType } from './FileTypeIcon';
import FileVisibilityBadge from './FileVisibilityBadge';

interface FileCardProps {
  file: FileItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDoubleClick: (file: FileItem) => void;
}

export default function FileCard({ file, isSelected, onSelect, onDoubleClick }: FileCardProps) {
  const fileType = getFileType(file.mimeType, file.type === 'folder');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '--';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
  };

  return (
    <div
      className={`group relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:shadow-md ${
        isSelected
          ? 'border-vaultly-500 bg-vaultly-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={() => onSelect(file.id)}
      onDoubleClick={() => onDoubleClick(file)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(file.id);
        }
      }}
    >
      <div className="mb-3 flex items-start justify-between">
        <FileTypeIcon type={fileType} />
        <FileVisibilityBadge isPublic={file.isPublic} />
      </div>

      <h3 className="mb-1 truncate text-sm font-medium text-gray-900">{file.name}</h3>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatSize(file.size)}</span>
        <span>{formatDate(file.updatedAt)}</span>
      </div>

      {isSelected && (
        <div className="absolute top-2 right-2">
          <svg className="h-5 w-5 text-vaultly-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
      )}
    </div>
  );
}
