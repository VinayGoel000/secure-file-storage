import { UploadItem } from '@/types';
import UploadProgress from './UploadProgress';

interface UploadItemProps {
  upload: UploadItem;
  onCancel: () => void;
  onPause: () => void;
}

export default function UploadItemComponent({ upload, onCancel, onPause }: UploadItemProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
  };

  const statusColors: Record<string, string> = {
    pending: 'text-gray-500',
    uploading: 'text-vaultly-600',
    paused: 'text-yellow-600',
    completed: 'text-green-600',
    error: 'text-red-600',
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <p className="truncate text-sm font-medium text-gray-900">{upload.name}</p>
          <span className={`text-xs ${statusColors[upload.status]}`}>
            {upload.status === 'completed' ? 'Done' : upload.status === 'paused' ? 'Paused' : `${Math.round(upload.progress)}%`}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <UploadProgress progress={upload.progress} status={upload.status} />
          <span className="text-xs text-gray-500">
            {formatSize(upload.size * upload.progress / 100)} / {formatSize(upload.size)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {upload.status !== 'completed' && (
          <button
            type="button"
            onClick={onPause}
            className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label={upload.status === 'paused' ? 'Resume' : 'Pause'}
          >
            {upload.status === 'paused' ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              </svg>
            )}
          </button>
        )}

        <button
          type="button"
          onClick={onCancel}
          className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600"
          aria-label="Cancel upload"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
