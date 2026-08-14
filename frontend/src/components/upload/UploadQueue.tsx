import { UploadItem } from '@/types';
import UploadItemComponent from './UploadItem';

interface UploadQueueProps {
  uploads: UploadItem[];
  onCancel: (id: string) => void;
  onPause: (id: string) => void;
}

export default function UploadQueue({ uploads, onCancel, onPause }: UploadQueueProps) {
  return (
    <div className="max-h-64 overflow-y-auto">
      <h3 className="mb-3 text-sm font-medium text-gray-700">Upload Queue</h3>
      <div className="space-y-3">
        {uploads.map((upload) => (
          <UploadItemComponent
            key={upload.id}
            upload={upload}
            onCancel={() => onCancel(upload.id)}
            onPause={() => onPause(upload.id)}
          />
        ))}
      </div>
    </div>
  );
}
