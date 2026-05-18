import { Menu } from 'lucide-react';

import { useLayout } from '@/src/context/LayoutCtx';

export const MobileTopBar = () => {
  const { toggleSidebar } = useLayout();

  return (
    <div className= 'flex lg:hidden justify-between items-center shrink-0 h-16 px-6 bg-white border-b border-slate-200 z-20'>
      <button
        onClick= { toggleSidebar }
        className= '-ml-2 p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors'
      >
        <Menu size= { 24 } />
      </button>
      <span className= 'hidden min-[360px]:block font-display font-semibold text-lg text-slate-900 tracking-tight'>
        WealthTracker
      </span>
      <div className= 'flex justify-center items-center shrink-0 w-8 h-8'>
        <img src= './favicon.svg' className= 'w-auto h-6' />
      </div>
    </div>
  );
};
