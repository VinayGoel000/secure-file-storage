'use client';

import { FileItem } from '@/types';
import FileTypeIcon, { getFileType } from './FileTypeIcon';
import FileVisibilityBadge from './FileVisibilityBadge';

interface FileDetailsPanelProps {
  file: FileItem;
  onClose: () => void;
}

export default function FileDetailsPanel({ file, onClose }: FileDetailsPanelProps) {
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
    <div className="flex h-full flex-col border-l border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-900">File Details</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="Close details"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6 flex flex-col items-center text-center">
          <FileTypeIcon type={fileType} className="mb-3 h-16 w-16" />
          <h3 className="mb-1 text-lg font-medium text-gray-900">{file.name}</h3>
          <FileVisibilityBadge isPublic={file.isPublic} />
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Information</h4>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Type</dt>
                <dd className="text-sm text-gray-900 capitalize">{file.type}</dd>
              </div>
              {file.type === 'file' && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Size</dt>
                  <dd className="text-sm text-gray-900">{formatSize(file.size)}</dd>
                </div>
              )}
              {file.mimeType && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">MIME Type</dt>
                  <dd className="text-sm text-gray-900">{file.mimeType}</dd>
                </div>
              )}
            </dl>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Dates</h4>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Created</dt>
                <dd className="text-sm text-gray-900">{formatDate(file.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Modified</dt>
                <dd className="text-sm text-gray-900">{formatDate(file.updatedAt)}</dd>
              </div>
            </dl>
          </div>

          {file.shareToken && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Sharing</h4>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Share link available</p>
                <button
                  type="button"
                  className="mt-2 text-xs font-medium text-vaultly-600 hover:text-vaultly-700"
                >
                  Copy share link
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <button type="button" className="btn-secondary flex-1">
            Download
          </button>
          <button type="button" className="btn-ghost text-red-600 hover:bg-red-50">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
