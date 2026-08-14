interface UploadProgressProps {
  progress: number;
  status: 'pending' | 'uploading' | 'paused' | 'completed' | 'error';
}

export default function UploadProgress({ progress, status }: UploadProgressProps) {
  const barColors: Record<string, string> = {
    pending: 'bg-gray-300',
    uploading: 'bg-vaultly-600',
    paused: 'bg-yellow-500',
    completed: 'bg-green-500',
    error: 'bg-red-500',
  };

  return (
    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
      <div
        className={`h-full rounded-full transition-all ${barColors[status]}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
