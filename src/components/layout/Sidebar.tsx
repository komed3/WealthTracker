import { ChevronLeft, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { NavLink } from 'react-router';

import routes from '@/src/config/routes';
import { useLayout } from '@/src/context/LayoutCtx';
import i18n from '@/src/lib/i18n';
import { cn } from '@/src/lib/utils';

export const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useLayout();

  return (
    <motion.aside
      className= 'relative flex flex-col min-h-screen whitespace-nowrap bg-white border-r border-slate-200 shadow-sm overflow-hidden z-10'
      initial= { false }
      animate= { { width: sidebarOpen ? 320 : 80 } }
      transition= { { duration: 0.3, ease: 'easeIn' } }
    >
      { /** Header / Logo */ }
      <div className= 'flex items-center gap-4 h-20 px-6 shrink-0 border-b border-slate-100'>
        <div className= 'flex justify-center items-center w-8 shrink-0'>
          <img src= './favicon.svg' className= 'w-auto h-8' />
        </div>
        <span className= 'truncate font-display font-semibold text-xl text-slate-900 tracking-tight'>
          WealthTracker
        </span>
      </div>

      { /** Navigation */ }
      <nav className= 'flex-1 px-4 py-6 space-y-1 overflow-x-hidden overflow-y-auto scrollbar-none'>
        { routes.map( r => (
          <NavLink
            key= { r.to }
            to= { r.to }
            className= { ( { isActive } ) => cn(
              'group flex items-center gap-4 h-12 px-2 rounded-xl transition-all duration-200',
              isActive
                ? 'font-semibold text-primary bg-primary/5'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            ) }
          >
            <div className= 'flex justify-center items-center w-8 shrink-0'>
              <r.icon
                className= 'shrink-0 transition-transform duration-200 group-hover:scale-110'
                size= { 22 }
                strokeWidth= { 2 }
              />
            </div>
            <span className= 'truncate font-medium'>
              { r.label }
            </span>
          </NavLink>
        ) ) }
      </nav>

      { /* Footer */ }
      <div className= 'flex flex-col gap-1 p-4 shrink-0 border-t border-slate-200'>
        <NavLink
          to= '/settings'
          className= { ( { isActive } ) => cn(
            'group flex items-center gap-4 h-12 px-2 rounded-xl transition-all duration-200',
            isActive
              ? 'font-semibold text-primary bg-primary/5'
              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          ) }
        >
          <div className= 'flex justify-center items-center w-8 shrink-0'>
            <Settings
              className= 'shrink-0 transition-transform duration-200 group-hover:rotate-90'
              size= { 22 }
              strokeWidth= { 2 }
            />
          </div>
          <span className= 'truncate font-medium'>
            { i18n.t( $ => $.sidebar.settings ) }
          </span>
        </NavLink>

        <button
          className= 'group flex items-center gap-4 h-12 px-2 rounded-xl text-slate-400 transition-all duration-200 hover:text-slate-600 hover:bg-slate-50'
          onClick= { toggleSidebar }
          title= { sidebarOpen ? i18n.t( $ => $.sidebar.collapse ) : i18n.t( $ => $.sidebar.expand ) }
        >
          <div className= 'flex justify-center items-center w-8 shrink-0'>
            <ChevronLeft
              className= { cn(
                'shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5',
                ! sidebarOpen && 'rotate-180 group-hover:translate-x-0.5'
              ) }
              size= { 24 }
            />
          </div>
          <span className= 'truncate font-medium'>
            { i18n.t( $ => $.sidebar.collapse ) }
          </span>
        </button>
      </div>
    </motion.aside>
  );
};
