interface EmptyFilesStateProps {
  hasSearch: boolean;
}

export default function EmptyFilesState({ hasSearch }: EmptyFilesStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
      </div>
      <h3 className="mb-1 text-lg font-medium text-gray-900">
        {hasSearch ? 'No files found' : 'No files yet'}
      </h3>
      <p className="max-w-sm text-sm text-gray-500">
        {hasSearch
          ? 'Try adjusting your search terms or browse all files.'
          : 'Upload your first file to get started with Vaultly.'}
      </p>
    </div>
  );
}
