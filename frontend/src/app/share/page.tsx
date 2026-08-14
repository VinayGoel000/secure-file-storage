'use client';

import { useState, useEffect } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SharePageState, ShareData } from '@/types';
import { mockShareData } from '@/lib/mockData';

export default function SharePage() {
  const [state, setState] = useState<SharePageState>('loading');
  const [data, setData] = useState<ShareData | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Simulate fetching share data
    const timer = setTimeout(() => {
      // Mock: randomly show different states for demo
      const random = Math.random();
      if (random > 0.3) {
        setData(mockShareData);
        setState('found');
      } else if (random > 0.15) {
        setState('not-found');
      } else {
        setState('expired');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsDownloading(false);
    setState('error');
  };

  const formatSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-2 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-vaultly-600">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-900">Vaultly</span>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-12">
        {state === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-sm text-gray-500">Loading shared file...</p>
          </div>
        )}

        {state === 'found' && data && (
          <div className="mx-auto max-w-md">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-vaultly-100">
                  <svg className="h-8 w-8 text-vaultly-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <h1 className="mb-1 text-xl font-semibold text-gray-900">{data.fileName}</h1>
                <p className="text-sm text-gray-500">{data.fileType} &middot; {formatSize(data.fileSize)}</p>
              </div>

              <div className="mb-6 rounded-lg bg-gray-50 p-4">
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Shared by</dt>
                    <dd className="font-medium text-gray-900">{data.sharedBy}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Date</dt>
                    <dd className="font-medium text-gray-900">
                      {new Date(data.sharedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Status</dt>
                    <dd>
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Public
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>

              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="btn-primary w-full"
              >
                {isDownloading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Preparing download...
                  </span>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download File
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs text-gray-400">
                This file is shared securely through Vaultly
              </p>
            </div>
          </div>
        )}

        {state === 'not-found' && (
          <div className="mx-auto max-w-md text-center py-20">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </div>
            </div>
            <h1 className="mb-2 text-xl font-semibold text-gray-900">File not found</h1>
            <p className="text-sm text-gray-500">
              This share link may have been removed or the file no longer exists.
            </p>
          </div>
        )}

        {state === 'expired' && (
          <div className="mx-auto max-w-md text-center py-20">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h1 className="mb-2 text-xl font-semibold text-gray-900">Link expired</h1>
            <p className="text-sm text-gray-500">
              This share link has expired. Please ask the file owner to generate a new link.
            </p>
          </div>
        )}

        {state === 'error' && (
          <div className="mx-auto max-w-md text-center py-20">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
            </div>
            <h1 className="mb-2 text-xl font-semibold text-gray-900">Download failed</h1>
            <p className="mb-6 text-sm text-gray-500">
              Something went wrong while trying to download this file. Please try again.
            </p>
            <button onClick={handleDownload} className="btn-primary">
              Try again
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-gray-400">
          Secured by Vaultly &middot; End-to-end encrypted file sharing
        </div>
      </footer>
    </div>
  );
}
