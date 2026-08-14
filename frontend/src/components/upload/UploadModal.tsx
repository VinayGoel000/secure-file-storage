'use client';

import { useState, useCallback, useRef } from 'react';
import Modal from '@/components/ui/Modal';
import DropZone from './DropZone';
import UploadQueue from './UploadQueue';
import { UploadItem, MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '@/types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const intervalsRef = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map());

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `File exceeds the ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB size limit`;
    }
    if (ALLOWED_FILE_TYPES.length > 0 && !ALLOWED_FILE_TYPES.includes(file.type)) {
      return `Unsupported file type: ${file.type || 'unknown'}`;
    }
    return null;
  };

  const handleFilesSelected = useCallback((files: File[]) => {
    const currentNames = new Set(uploads.map((u) => u.name.toLowerCase()));

    const newUploads: UploadItem[] = files.map((file) => {
      const validationError = validateFile(file) || (currentNames.has(file.name.toLowerCase()) ? 'A file with this name already exists' : null);
      currentNames.add(file.name.toLowerCase());

      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        name: file.name,
        size: file.size,
        progress: 0,
        status: validationError ? 'error' : 'pending',
        validationError: validationError || undefined,
      };
    });

    setUploads((prev) => [...prev, ...newUploads]);
  }, [uploads]);

  const simulateUpload = useCallback((id: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      setUploads((prev) => {
        const upload = prev.find((u) => u.id === id);
        if (!upload || upload.status === 'paused' || upload.status === 'error') {
          clearInterval(interval);
          intervalsRef.current.delete(id);
          return prev;
        }

        progress += Math.random() * 12 + 3;
        if (progress >= 100) {
          clearInterval(interval);
          intervalsRef.current.delete(id);
          return prev.map((u) =>
            u.id === id ? { ...u, progress: 100, status: 'completed' } : u
          );
        }

        return prev.map((u) =>
          u.id === id ? { ...u, progress: Math.min(progress, 99), status: 'uploading' } : u
        );
      });
    }, 400);
    intervalsRef.current.set(id, interval);
  }, []);

  const handleStartUpload = useCallback(() => {
    setUploads((prev) => {
      const toUpload = prev.filter((u) => u.status === 'pending');
      toUpload.forEach((u) => {
        setTimeout(() => simulateUpload(u.id), Math.random() * 500);
      });
      return prev.map((u) =>
        u.status === 'pending' ? { ...u, status: 'uploading' as const } : u
      );
    });
  }, [simulateUpload]);

  const handleCancel = useCallback((id: string) => {
    const interval = intervalsRef.current.get(id);
    if (interval) {
      clearInterval(interval);
      intervalsRef.current.delete(id);
    }
    setUploads((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const handlePause = useCallback((id: string) => {
    setUploads((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'paused' ? 'uploading' : 'paused' }
          : u
      )
    );
  }, []);

  const handleRetry = useCallback((id: string) => {
    setUploads((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: 'pending', progress: 0, validationError: undefined } : u
      )
    );
  }, []);

  const handleDismissAll = useCallback(() => {
    intervalsRef.current.forEach((interval) => clearInterval(interval));
    intervalsRef.current.clear();
    setUploads([]);
  }, []);

  const hasUploads = uploads.length > 0;
  const hasPending = uploads.some((u) => u.status === 'pending');
  const allDone = hasUploads && uploads.every((u) => u.status === 'completed' || u.status === 'error');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Upload Files</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-vaultly-500"
            aria-label="Close upload modal"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <DropZone onFilesSelected={handleFilesSelected} />

        <p className="mt-2 text-center text-xs text-gray-500">
          Maximum file size: 100MB. Supported: PDF, ZIP, DOCX, XLSX, PNG, JPG, and more.
        </p>

        {hasUploads && (
          <div className="mt-6">
            <UploadQueue
              uploads={uploads}
              onCancel={handleCancel}
              onPause={handlePause}
              onRetry={handleRetry}
            />
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          {allDone ? (
            <button type="button" onClick={() => { handleDismissAll(); onClose(); }} className="btn-primary">
              Done
            </button>
          ) : (
            <>
              <button type="button" onClick={() => { handleDismissAll(); onClose(); }} className="btn-secondary">
                Cancel
              </button>
              {hasPending && (
                <button type="button" onClick={handleStartUpload} className="btn-primary">
                  Start Upload ({uploads.filter((u) => u.status === 'pending').length})
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
