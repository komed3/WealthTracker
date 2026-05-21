import routes from '@/src/config/routes';
import { useLayout } from '@/src/context/LayoutCtx';
import i18n from '@/src/lib/i18n';
import { cn } from '@/src/lib/utils';
import { ChevronLeft, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import faviconUrl from '/favicon.svg?url';

const BREAKPOINT = 1024;

export const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useLayout();
  const [ isMobile, setIsMobile ] = useState( false );

  useEffect( () => {
    const checkMobile = () => setIsMobile( window.innerWidth < BREAKPOINT );

    checkMobile();
    window.addEventListener( 'resize', checkMobile );
    return () => window.removeEventListener( 'resize', checkMobile );
  }, [] );

  return (
    <>
      <AnimatePresence>
        { isMobile && sidebarOpen && (
          <motion.div
            initial= { { opacity: 0 } }
            animate= { { opacity: 1 } }
            exit= { { opacity: 0 } }
            transition= { { duration: 0.2 } }
            onClick= { toggleSidebar }
            className= 'fixed inset-0 z-30 bg-slate-950/20 backdrop-blur-xs'
          />
        ) }
      </AnimatePresence>

      <motion.aside
        className= { cn(
          'flex flex-col h-full whitespace-nowrap bg-white border-r border-slate-200 z-40 overflow-hidden',
          isMobile ? 'fixed inset-y-0 left-0 w-[320px] max-w-[85vw] shadow-2xl' : 'relative shadow-sm'
        ) }
        initial= { false }
        animate= {
          isMobile
            ? { x: sidebarOpen ? 0 : '-100%', width: '100%' }
            : { x: 0, width: sidebarOpen ? 320 : 80 }
        }
        transition= { { duration: 0.3, ease: 'easeOut' } }
      >
        { /** Header / Logo */ }
        <div className= 'flex items-center gap-4 shrink-0 h-20 px-6 border-b border-slate-100'>
          <div className= 'flex justify-center items-center shrink-0 w-8'>
            <img src= { faviconUrl } className= 'w-auto h-8' />
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
              onClick= { () => { if ( isMobile ) toggleSidebar() } }
              className= { ( { isActive } ) => cn(
                'group flex items-center gap-4 h-12 px-2 rounded-xl transition-all duration-200',
                isActive
                  ? 'font-semibold text-primary bg-primary/5'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              ) }
            >
              <div className= 'flex justify-center items-center shrink-0 w-8'>
                <r.icon
                  className= 'shrink-0 transition-transform duration-200 group-hover:scale-110'
                  size= { 22 }
                  strokeWidth= { 2 }
                />
              </div>
              <span className= 'truncate font-medium'>
                { i18n.t( $ => $.nav[ r.label ] ) }
              </span>
            </NavLink>
          ) ) }
        </nav>

        { /** Footer */ }
        <div className= 'flex flex-col gap-1 shrink-0 p-4 border-t border-slate-100'>
          <NavLink
            to= '/settings'
            onClick= { () => { if ( isMobile ) toggleSidebar() } }
            className= { ( { isActive } ) => cn(
              'group flex items-center gap-4 h-12 px-2 rounded-xl transition-all duration-200',
              isActive
                ? 'font-semibold text-primary bg-primary/5'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            ) }
          >
            <div className= 'flex justify-center items-center shrink-0 w-8'>
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
            <div className= 'flex justify-center items-center shrink-0 w-8'>
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
    </>
  );
};
