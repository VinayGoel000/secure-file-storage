import { FileItem } from '@/types';
import FileTypeIcon, { getFileType } from './FileTypeIcon';
import FileVisibilityBadge from './FileVisibilityBadge';

interface FileRowProps {
  file: FileItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDoubleClick: (file: FileItem) => void;
}

export default function FileRow({ file, isSelected, onSelect, onDoubleClick }: FileRowProps) {
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
      className={`group flex cursor-pointer items-center gap-4 rounded-lg border px-4 py-3 transition-all hover:shadow-sm ${
        isSelected
          ? 'border-vaultly-500 bg-vaultly-50 shadow-sm'
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
      <FileTypeIcon type={fileType} className="h-8 w-8" />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-medium text-gray-900">{file.name}</h3>
        <p className="text-xs text-gray-500">{formatDate(file.updatedAt)}</p>
      </div>

      <div className="hidden text-sm text-gray-500 sm:block">
        {formatSize(file.size)}
      </div>

      <FileVisibilityBadge isPublic={file.isPublic} />

      {isSelected && (
        <svg className="h-5 w-5 text-vaultly-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      )}
    </div>
  );
}
