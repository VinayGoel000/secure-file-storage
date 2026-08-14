'use client';

import { useState, useCallback } from 'react';
import Modal from '@/components/ui/Modal';
import DropZone from './DropZone';
import UploadQueue from './UploadQueue';
import { UploadItem } from '@/types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  const handleFilesSelected = useCallback((files: File[]) => {
    const newUploads: UploadItem[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'pending' as const,
    }));

    setUploads((prev) => [...prev, ...newUploads]);
  }, []);

  const handleCancel = useCallback((id: string) => {
    setUploads((prev) => prev.filter((upload) => upload.id !== id));
  }, []);

  const handlePause = useCallback((id: string) => {
    setUploads((prev) =>
      prev.map((upload) =>
        upload.id === id
          ? { ...upload, status: upload.status === 'paused' ? 'uploading' : 'paused' }
          : upload
      )
    );
  }, []);

  const handleStartUpload = useCallback(() => {
    setUploads((prev) =>
      prev.map((upload) =>
        upload.status === 'pending' ? { ...upload, status: 'uploading' as const } : upload
      )
    );

    // Simulate upload progress
    uploads.forEach((upload) => {
      if (upload.status === 'pending') {
        simulateUpload(upload.id, setUploads);
      }
    });
  }, [uploads]);

  const hasUploads = uploads.length > 0;
  const allCompleted = hasUploads && uploads.every((u) => u.status === 'completed');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Upload Files</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <DropZone onFilesSelected={handleFilesSelected} />

        {hasUploads && (
          <div className="mt-6">
            <UploadQueue
              uploads={uploads}
              onCancel={handleCancel}
              onPause={handlePause}
            />
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-secondary">
            {allCompleted ? 'Done' : 'Cancel'}
          </button>
          {!allCompleted && hasUploads && (
            <button type="button" onClick={handleStartUpload} className="btn-primary">
              Start Upload
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

function simulateUpload(
  id: string,
  setUploads: React.Dispatch<React.SetStateAction<UploadItem[]>>
) {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setUploads((prev) =>
        prev.map((upload) =>
          upload.id === id ? { ...upload, progress: 100, status: 'completed' } : upload
        )
      );
    } else {
      setUploads((prev) =>
        prev.map((upload) =>
          upload.id === id ? { ...upload, progress: Math.min(progress, 99) } : upload
        )
      );
    }
  }, 300);
}
