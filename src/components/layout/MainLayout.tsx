import { MobileTopBar } from '@/src/components/layout/MobileTopBar';
import { Sidebar } from '@/src/components/layout/Sidebar';
import { Loading } from '@/src/components/ui/Loading';
import { useData } from '@/src/context/DataCtx';
import type { LayoutProps } from '@/src/types/props';

export const MainLayout = ( { children }: LayoutProps ) => {
  const { loading } = useData();

  return loading ? <Loading className= 'bg-slate-50' /> : (
    <div className= 'flex flex-col lg:flex-row h-dvh overflow-hidden bg-slate-50 text-slate-800'>
      <MobileTopBar />
      <Sidebar />

      <main className= 'flex-1 flex flex-col min-w-0 overflow-y-auto transition-all duration-300 ease-in-out'>
        <div className= 'flex-1 w-full max-w-[1600px] mx-auto px-8 py-8 md:px-12 md:py-10'>
          { children }
        </div>
      </main>
    </div>
  );
};
