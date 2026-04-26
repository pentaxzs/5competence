import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

export const metadata: Metadata = {
  title: '5 Competences — AI 시대 역량 진단',
  description: 'Product Designer, Product Manager, UX Writer를 위한 AI 역량 자가진단 서비스',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSansKR.className}>
      <body className="antialiased bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
