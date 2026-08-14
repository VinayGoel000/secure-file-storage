import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vaultly - Secure File Storage',
  description: 'Secure file storage for professionals. Keep your files safe and accessible anywhere.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 font-sans text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
