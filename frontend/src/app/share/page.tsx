export default function SharePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-vaultly-100">
            <svg className="h-8 w-8 text-vaultly-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.813a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.374" />
            </svg>
          </div>
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Shared File</h1>
        <p className="mb-6 text-gray-500">
          This file has been shared with you via Vaultly.
        </p>
        <button className="btn-primary">
          Download File
        </button>
      </div>
    </div>
  );
}
