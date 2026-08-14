import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure File Storage',
  description: 'Secure File Storage Service',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
