// /app/layout.tsx
import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import { Providers } from './providers';
import UnauthLeftNav from '@/components/UnauthLeftNav';
// import Header from '@/components/header';
// import LeftNav from '@/components/leftNav';
// import RightSidebar from '@/components/rightSideBar';

export const metadata = { title: 'T-Convo', description: 'T-Convo feed' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster position="top-center"/>
          {/* <Header />
          <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 p-4">
            <aside className="hidden md:block"><LeftNav /></aside>
            <section className="md:col-span-2">{children}</section>
            <aside className="hidden lg:block"><RightSidebar /></aside>
          </main> */}
        </Providers>
      </body>
    </html>
  );
}
