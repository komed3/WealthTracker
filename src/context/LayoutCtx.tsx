import { Loading } from '@/src/components/ui/Loading';
import type { LayoutCtxType } from '@/src/types/context';
import type { LayoutProps } from '@/src/types/props';
import { AnimatePresence } from 'motion/react';
import { createContext, useContext, useEffect, useState } from 'react';

const LayoutCtx = createContext < LayoutCtxType | undefined > ( undefined );

const BREAKPOINT = 1024;

export function LayoutProvider ( { children }: LayoutProps ) {
  const [ sidebarOpen, setSidebarOpen ] = useState( () => {
    if ( typeof window !== 'undefined' ) {
      const saved = localStorage.getItem( 'sidebarOpen' );

      if ( saved !== null ) return saved === 'true';
      return window.innerWidth >= BREAKPOINT;
    }

    return true;
  } );

  const [ title, setTitleState ] = useState( '' );
  const [ loading, setLoading ] = useState( false );

  const setTitle = ( newTitle: string ) => {
    setTitleState( newTitle );

    if ( typeof window !== 'undefined' ) {
      document.title = newTitle ? `${ newTitle } — WealthTracker` : 'WealthTracker';
    }
  };

  const toggleSidebar = () => setSidebarOpen( prev => {
    const next = ! prev;
    localStorage.setItem( 'sidebarOpen', String( next ) );
    return next;
  } );

  useEffect( () => {
    const handleResize = () => {
      if ( window.innerWidth < BREAKPOINT ) setSidebarOpen( false );
      else {
        const saved = localStorage.getItem( 'sidebarOpen' );
        setSidebarOpen( saved !== null ? saved === 'true' : true );
      }
    };

    window.addEventListener( 'resize', handleResize );
    return () => window.removeEventListener( 'resize', handleResize );
  }, [] );

  return (
    <LayoutCtx.Provider
      value= { {
        title, setTitle, loading, setLoading, toggleSidebar,
        sidebarOpen, setSidebarOpen: ( open: boolean ) => {
          setSidebarOpen( open );
          localStorage.setItem( 'sidebarOpen', String( open ) );
        }
      } }
    >
      { children }
      <AnimatePresence>
        { loading && <Loading /> }
      </AnimatePresence>
    </LayoutCtx.Provider>
  );
}

export function useLayout () : LayoutCtxType {
  const context = useContext( LayoutCtx );
  if ( context === undefined ) throw new Error( 'useLayout must be used within a LayoutProvider' );
  return context;
}

export function useIsMobile ( breakpoint = 768 ) {
  const [ isMobile, setIsMobile ] = useState( false );

  useEffect( () => {
    const checkMobile = () => setIsMobile( window.innerWidth < breakpoint );

    checkMobile();
    window.addEventListener( 'resize', checkMobile );
    return () => window.removeEventListener( 'resize', checkMobile );
  }, [ breakpoint ] );

  return isMobile;
}
