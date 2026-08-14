'use client';

import { useState, useCallback, useRef } from 'react';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
}

export default function DropZone({ onFilesSelected }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounterRef = useRef(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current++;
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragCounterRef.current = 0;
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onFilesSelected(files);
      }
      e.target.value = '';
    },
    [onFilesSelected]
  );

  return (
    <div
      className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
        isDragging
          ? 'border-vaultly-500 bg-vaultly-50'
          : 'border-gray-300 hover:border-vaultly-400'
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="region"
      aria-label="File upload area"
    >
      <div className="flex flex-col items-center">
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
          isDragging ? 'bg-vaultly-100' : 'bg-gray-100'
        }`}>
          <svg className={`h-6 w-6 transition-colors ${isDragging ? 'text-vaultly-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
        </div>

        <p className="mb-2 text-sm text-gray-600">
          <span className="font-medium text-vaultly-600">Click to upload</span> or drag and drop
        </p>

        <p className="text-xs text-gray-500">
          ZIP, PDF, DOCX, XLSX, PNG, JPG up to 100MB
        </p>
      </div>

      <input
        type="file"
        multiple
        className="absolute inset-0 cursor-pointer opacity-0"
        onChange={handleFileInput}
        aria-label="Select files to upload"
      />
    </div>
  );
}
