'use client';

import { FileItem } from '@/types';
import FileCard from './FileCard';
import FileRow from './FileRow';

interface FileGridProps {
  files: FileItem[];
  selectedFileId: string | null;
  viewMode: 'grid' | 'list';
  onSelectFile: (id: string) => void;
  onDoubleClickFile: (file: FileItem) => void;
  onContextMenu: (e: React.MouseEvent, fileId: string) => void;
  onClickFile?: (file: FileItem) => void;
}

export default function FileGrid({
  files,
  selectedFileId,
  viewMode,
  onSelectFile,
  onDoubleClickFile,
  onContextMenu,
  onClickFile,
}: FileGridProps) {
  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-2">
        {files.map((file) => (
          <FileRow
            key={file.id}
            file={file}
            isSelected={selectedFileId === file.id}
            onSelect={onSelectFile}
            onDoubleClick={onDoubleClickFile}
            onContextMenu={onContextMenu}
            onClickFile={onClickFile}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          isSelected={selectedFileId === file.id}
          onSelect={onSelectFile}
          onDoubleClick={onDoubleClickFile}
          onContextMenu={onContextMenu}
          onClickFile={onClickFile}
        />
      ))}
    </div>
  );
}
