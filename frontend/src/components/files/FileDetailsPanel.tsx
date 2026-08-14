'use client';

import { FileItem } from '@/types';
import FileTypeIcon, { getFileType } from './FileTypeIcon';
import FileVisibilityBadge from './FileVisibilityBadge';

interface FileDetailsPanelProps {
  file: FileItem;
  onClose: () => void;
  onRename: () => void;
  onTogglePublic: () => void;
  onDelete: () => void;
  onCopyShareLink: () => void;
}

export default function FileDetailsPanel({
  file,
  onClose,
  onRename,
  onTogglePublic,
  onDelete,
  onCopyShareLink,
}: FileDetailsPanelProps) {
  const fileType = getFileType(file.mimeType, file.type === 'folder');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
  };

  return (
    <div className="sticky top-20 flex h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">File Details</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-vaultly-500"
          aria-label="Close details panel"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6 flex flex-col items-center text-center">
          <FileTypeIcon type={fileType} className="mb-3 h-16 w-16" />
          <h3 className="mb-1 text-base font-medium text-gray-900">{file.name}</h3>
          <FileVisibilityBadge isPublic={file.isPublic} />
        </div>

        <div className="space-y-5">
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Information</h4>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Type</dt>
                <dd className="text-sm font-medium text-gray-900 capitalize">{file.type}</dd>
              </div>
              {file.type === 'file' && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Size</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatSize(file.size)}</dd>
                </div>
              )}
              {file.mimeType && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">MIME</dt>
                  <dd className="max-w-[150px] truncate text-sm font-medium text-gray-900" title={file.mimeType}>
                    {file.mimeType}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Dates</h4>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Created</dt>
                <dd className="text-sm font-medium text-gray-900">{formatDate(file.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Modified</dt>
                <dd className="text-sm font-medium text-gray-900">{formatDate(file.updatedAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-2">
            <button
              onClick={onCopyShareLink}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.813a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.374" />
              </svg>
              Copy share link
            </button>
            <button
              onClick={onRename}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Rename
            </button>
            <button
              onClick={onTogglePublic}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
            >
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              {file.isPublic ? 'Make private' : 'Make public'}
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-secondary flex-1"
            onClick={() => console.log('Download', file.name)}
          >
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-red-200 p-2 text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Delete file"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
