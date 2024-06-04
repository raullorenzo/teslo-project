import type { Metadata } from 'next';
import { inter } from '@/config/fonts';
import { Providers } from '@/components';
import './globals.css';


export const metadata: Metadata = {
  title: {
    template: '%s - Teslo | shop',
    default: 'Home - Teslo | shop',
  },
  description: 'Una tienda virtual de productos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}