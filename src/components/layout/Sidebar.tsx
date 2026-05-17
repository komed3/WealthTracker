import { motion } from 'motion/react';
import { NavLink } from 'react-router';

import routes from '@/src/config/routes';
import { useLayout } from '@/src/context/LayoutCtx';
import { cn } from '@/src/lib/utils';
import { ChevronLeft } from 'lucide-react';

export const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useLayout();

  return (
    <motion.aside
      className= 'flex-1 flex flex-col h-full whitespace-nowrap bg-white border-r border-slate-300 transition-all'
      initial= { false }
      animate= { { width: sidebarOpen ? 320 : 86 } }
    >
      <div className= 'flex items-center gap-4 mb-8 h-16 px-6'>
        <img src= './favicon.svg' className= 'h-8' />
        <span className= 'truncate font-display font-semibold text-lg tracking-tight'>
          WealthTracker
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        { routes.map( r => (
          <NavLink
            key= { r.to }
            to= { r.to }
            className= { ( { isActive } ) => cn(
              'group flex items-center gap-4 h-12 px-4 rounded-xl transition-all duration-200',
              isActive
                ? 'text-primary bg-primary/5'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            ) }
          >
            <r.icon
              className= 'shrink-0'
              size={ 20 }
              strokeWidth= { 2 }
            />
            <span className= 'truncate font-medium'>
              { r.label }
            </span>
          </NavLink>
        ) ) }
      </nav>

      <div className= 'p-4 border-t border-slate-300'>
        <button
          className= 'flex justify-center items-center w-full h-10 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all'
          onClick= { toggleSidebar }
        >
          <ChevronLeft
            className= { cn(
              'transition-transform duration-300',
              ! sidebarOpen && 'rotate-180'
            ) }
            size= { 24 }
          />
        </button>
      </div>
    </motion.aside>
  );
};
