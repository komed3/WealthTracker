import { Sidebar } from '@/src/components/layout/Sidebar';
import type { LayoutProps } from '@/src/types/props';

export const MainLayout = ( { children }: LayoutProps ) => {
  return (
    <div className= 'flex min-h-screen bg-slate-50 text-slate-800 antialiased'>
      <Sidebar />

      <main className= 'flex-1 flex flex-col min-w-0 overflow-y-auto transition-all duration-300 ease-in-out'>
        <div className= 'flex-1 w-full max-w-[1600px] mx-auto px-8 py-8 md:px-12 md:py-10'>
          { children }
        </div>
      </main>
    </div>
  );
};
