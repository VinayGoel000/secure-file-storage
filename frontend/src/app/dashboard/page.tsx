'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import MobileNavigation from '@/components/layout/MobileNavigation';
import FileGrid from '@/components/files/FileGrid';
import FileDetailsPanel from '@/components/files/FileDetailsPanel';
import FileContextMenu from '@/components/files/FileContextMenu';
import MobileDetailsSheet from '@/components/files/MobileDetailsSheet';
import EmptyFilesState from '@/components/files/EmptyFilesState';
import UploadModal from '@/components/upload/UploadModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import RenameModal from '@/components/ui/RenameModal';
import Toast from '@/components/ui/Toast';
import { mockFiles as initialMockFiles } from '@/lib/mockData';
import { useState, useMemo, useCallback } from 'react';
import { FileItem } from '@/types';

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <DashboardContent />;
}

function DashboardContent() {
  const [files, setFiles] = useState<FileItem[]>(initialMockFiles);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; fileId: string } | null>(null);
  const [renameModal, setRenameModal] = useState<{ isOpen: boolean; fileId: string | null }>({ isOpen: false, fileId: null });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; fileId: string | null }>({ isOpen: false, fileId: null });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const filteredFiles = useMemo(() => {
    if (!searchQuery) return files;
    return files.filter((file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [files, searchQuery]);

  const selectedFile = useMemo(() => {
    if (!selectedFileId) return null;
    return files.find((f) => f.id === selectedFileId) || null;
  }, [selectedFileId, files]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  }, []);

  const handleSelectFile = useCallback((id: string) => {
    setSelectedFileId((prev) => (prev === id ? null : id));
  }, []);

  const handleDoubleClickFile = useCallback((file: FileItem) => {
    if (file.type === 'folder') return;
    showToast(`Opening ${file.name}...`, 'info');
  }, [showToast]);

  const handleContextMenu = useCallback((e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, fileId });
  }, []);

  const handleCopyShareLink = useCallback((fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file) {
      const link = file.shareToken
        ? `${window.location.origin}/share/${file.shareToken}`
        : `${window.location.origin}/share/${file.id}`;
      navigator.clipboard?.writeText(link).then(() => {
        showToast('Share link copied to clipboard');
      }).catch(() => {
        showToast('Share link copied', 'info');
      });
    }
  }, [files, showToast]);

  const handleRename = useCallback((fileId: string, newName: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, name: newName, updatedAt: new Date().toISOString() } : f))
    );
    showToast('File renamed successfully');
  }, [showToast]);

  const handleTogglePublic = useCallback((fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id !== fileId) return f;
        const newIsPublic = !f.isPublic;
        return {
          ...f,
          isPublic: newIsPublic,
          shareToken: newIsPublic ? f.shareToken || Math.random().toString(36).slice(2) : undefined,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    const file = files.find((f) => f.id === fileId);
    if (file) {
      showToast(file.isPublic ? 'File is now private' : 'File is now public');
    }
  }, [files, showToast]);

  const handleDelete = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (selectedFileId === fileId) setSelectedFileId(null);
    showToast('File deleted');
  }, [selectedFileId, showToast]);

  const handleOpenDetailsMobile = useCallback(() => {
    if (selectedFile) setIsMobileDetailsOpen(true);
  }, [selectedFile]);

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
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden items-center rounded-lg border border-gray-200 bg-white sm:flex">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-l-lg p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`rounded-r-lg p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            <div className={`min-w-0 flex-1 ${selectedFile ? 'hidden lg:block' : ''}`}>
              {filteredFiles.length > 0 ? (
                <FileGrid
                  files={filteredFiles}
                  selectedFileId={selectedFileId}
                  viewMode={viewMode}
                  onSelectFile={handleSelectFile}
                  onDoubleClickFile={handleDoubleClickFile}
                  onContextMenu={handleContextMenu}
                  onClickFile={handleOpenDetailsMobile}
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
                  onRename={() => setRenameModal({ isOpen: true, fileId: selectedFile.id })}
                  onTogglePublic={() => handleTogglePublic(selectedFile.id)}
                  onDelete={() => setDeleteModal({ isOpen: true, fileId: selectedFile.id })}
                  onCopyShareLink={() => handleCopyShareLink(selectedFile.id)}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {selectedFile && (
        <MobileDetailsSheet
          file={selectedFile}
          isOpen={isMobileDetailsOpen}
          onClose={() => setIsMobileDetailsOpen(false)}
          onRename={() => setRenameModal({ isOpen: true, fileId: selectedFile.id })}
          onTogglePublic={() => handleTogglePublic(selectedFile.id)}
          onDelete={() => setDeleteModal({ isOpen: true, fileId: selectedFile.id })}
          onCopyShareLink={() => handleCopyShareLink(selectedFile.id)}
        />
      )}

      {contextMenu && (
        <FileContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onDownload={() => {
            const file = files.find((f) => f.id === contextMenu.fileId);
            if (file) showToast(`Downloading ${file.name}...`, 'info');
          }}
          onCopyShareLink={() => handleCopyShareLink(contextMenu.fileId)}
          onRename={() => setRenameModal({ isOpen: true, fileId: contextMenu.fileId })}
          onTogglePublic={() => handleTogglePublic(contextMenu.fileId)}
          onDelete={() => setDeleteModal({ isOpen: true, fileId: contextMenu.fileId })}
          isPublic={files.find((f) => f.id === contextMenu.fileId)?.isPublic ?? false}
        />
      )}

      <RenameModal
        isOpen={renameModal.isOpen}
        onClose={() => setRenameModal({ isOpen: false, fileId: null })}
        onRename={(newName) => {
          if (renameModal.fileId) handleRename(renameModal.fileId, newName);
        }}
        currentName={files.find((f) => f.id === renameModal.fileId)?.name ?? ''}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, fileId: null })}
        onConfirm={() => {
          if (deleteModal.fileId) handleDelete(deleteModal.fileId);
          setDeleteModal({ isOpen: false, fileId: null });
        }}
        title="Delete file"
        message="Are you sure you want to delete this file? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
