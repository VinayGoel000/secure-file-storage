import { UploadItem } from '@/types';
import UploadItemComponent from './UploadItem';

interface UploadQueueProps {
  uploads: UploadItem[];
  onCancel: (id: string) => void;
  onPause: (id: string) => void;
  onRetry: (id: string) => void;
}

export default function UploadQueue({ uploads, onCancel, onPause, onRetry }: UploadQueueProps) {
  return (
    <div className="max-h-72 overflow-y-auto">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          Upload Queue ({uploads.length} {uploads.length === 1 ? 'file' : 'files'})
        </h3>
        <span className="text-xs text-gray-500">
          {uploads.filter((u) => u.status === 'completed').length} completed
        </span>
      </div>
      <div className="space-y-2">
        {uploads.map((upload) => (
          <UploadItemComponent
            key={upload.id}
            upload={upload}
            onCancel={() => onCancel(upload.id)}
            onPause={() => onPause(upload.id)}
            onRetry={() => onRetry(upload.id)}
          />
        ))}
      </div>
    </div>
  );
}
