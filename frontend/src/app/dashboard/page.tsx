'use client';

import { useState, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import MobileNavigation from '@/components/layout/MobileNavigation';
import FileGrid from '@/components/files/FileGrid';
import FileDetailsPanel from '@/components/files/FileDetailsPanel';
import EmptyFilesState from '@/components/files/EmptyFilesState';
import UploadModal from '@/components/upload/UploadModal';
import { mockFiles } from '@/lib/mockData';
import { FileItem } from '@/types';

export default function DashboardPage() {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const filteredFiles = useMemo(() => {
    if (!searchQuery) return mockFiles;
    return mockFiles.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const selectedFile = useMemo(() => {
    if (!selectedFileId) return null;
    return mockFiles.find((f) => f.id === selectedFileId) || null;
  }, [selectedFileId]);

  const handleSelectFile = (id: string) => {
    setSelectedFileId(id === selectedFileId ? null : id);
  };

  const handleDoubleClickFile = (file: FileItem) => {
    console.log('Open file:', file.name);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="lg:pl-64">
        <Topbar
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onSearch={setSearchQuery}
          onUploadClick={() => setIsUploadModalOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Files</h1>
              <p className="mt-1 text-sm text-gray-500">
                {filteredFiles.length} {filteredFiles.length === 1 ? 'item' : 'items'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`rounded-lg p-2 ${
                  viewMode === 'grid'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                aria-label="Grid view"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`rounded-lg p-2 ${
                  viewMode === 'list'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
                aria-label="List view"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            <div className={`flex-1 ${selectedFile ? 'hidden lg:block lg:max-w-[calc(100%-320px)]' : ''}`}>
              {filteredFiles.length > 0 ? (
                <FileGrid
                  files={filteredFiles}
                  selectedFileId={selectedFileId}
                  viewMode={viewMode}
                  onSelectFile={handleSelectFile}
                  onDoubleClickFile={handleDoubleClickFile}
                />
              ) : (
                <EmptyFilesState hasSearch={!!searchQuery} />
              )}
            </div>

            {selectedFile && (
              <div className="hidden w-80 flex-shrink-0 lg:block">
                <FileDetailsPanel
                  file={selectedFile}
                  onClose={() => setSelectedFileId(null)}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
