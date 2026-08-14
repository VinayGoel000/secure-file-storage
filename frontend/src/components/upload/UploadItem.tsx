'use client';

import { UploadItem } from '@/types';
import UploadProgress from './UploadProgress';

interface UploadItemProps {
  upload: UploadItem;
  onCancel: () => void;
  onPause: () => void;
  onRetry: () => void;
}

export default function UploadItemComponent({ upload, onCancel, onPause, onRetry }: UploadItemProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
  };

  const statusConfig: Record<string, { text: string; color: string }> = {
    pending: { text: 'Waiting...', color: 'text-gray-500' },
    uploading: { text: `${Math.round(upload.progress)}%`, color: 'text-vaultly-600' },
    paused: { text: 'Paused', color: 'text-yellow-600' },
    completed: { text: 'Done', color: 'text-green-600' },
    error: { text: upload.validationError || 'Failed', color: 'text-red-600' },
    validating: { text: 'Validating...', color: 'text-gray-500' },
  };

  const { text: statusText, color: statusColor } = statusConfig[upload.status] || statusConfig.pending;

  return (
    <div className={`rounded-xl border p-3 transition-colors ${
      upload.status === 'error' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
    }`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
          upload.status === 'error' ? 'bg-red-100' : 'bg-gray-100'
        }`}>
          {upload.status === 'error' ? (
            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          ) : upload.status === 'completed' ? (
            <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium text-gray-900">{upload.name}</p>
            <span className={`shrink-0 text-xs font-medium ${statusColor}`}>
              {statusText}
            </span>
          </div>

          <div className="mt-1.5 flex items-center gap-2">
            <UploadProgress progress={upload.progress} status={upload.status} />
            <span className="shrink-0 text-xs text-gray-500">
              {formatSize(upload.size)}
            </span>
          </div>

          {upload.status === 'error' && upload.validationError && (
            <p className="mt-1 text-xs text-red-600">{upload.validationError}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {upload.status === 'error' && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-vaultly-600 focus:outline-none focus:ring-2 focus:ring-vaultly-500"
              aria-label="Retry upload"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
            </button>
          )}
          {(upload.status === 'uploading' || upload.status === 'paused') && (
            <button
              type="button"
              onClick={onPause}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-vaultly-500"
              aria-label={upload.status === 'paused' ? 'Resume upload' : 'Pause upload'}
            >
              {upload.status === 'paused' ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                </svg>
              )}
            </button>
          )}
          <button
            type="button"
            onClick={onCancel}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Cancel upload"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
