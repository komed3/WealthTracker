import { MobileTopBar } from '@/src/components/layout/MobileTopBar';
import { Sidebar } from '@/src/components/layout/Sidebar';
import { Loading } from '@/src/components/ui/Loading';
import { useData } from '@/src/context/DataCtx';
import type { LayoutProps } from '@/src/types/props';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

export const MainLayout = ( { children }: LayoutProps ) => {
  const { loading } = useData();
  const location = useLocation();
  const mainRef = useRef < HTMLDivElement > ( null );

  useEffect( () => { if ( mainRef.current ) mainRef.current.scrollTop = 0 }, [ location.pathname ] );

  return loading ? <Loading className= 'bg-slate-50' /> : (
    <div className= 'flex flex-col lg:flex-row h-dvh overflow-hidden bg-slate-50 text-slate-800'>
      <MobileTopBar />
      <Sidebar />

      <main
        className= 'flex-1 flex flex-col min-w-0 overflow-y-auto transition-all duration-300 ease-in-out'
        ref= { mainRef }
      >
        <div className= 'flex-1 flex flex-col w-full max-w-400 mx-auto px-4 py-6 sm:px-8 sm:py-8 md:px-12 md:py-10'>
          { children }
        </div>
      </main>
    </div>
  );
};
