import { createContext, useContext, useState } from 'react';
import type { LayoutCtxType } from '../types/context';
import type { LayoutProps } from '../types/props';

const LayoutCtx = createContext < LayoutCtxType | undefined > ( undefined );

export function LayoutProvider ( { children }: LayoutProps ) {
  const [ sidebarOpen, setSidebarOpen ] = useState( true );
  const toggleSidebar = () => setSidebarOpen( prev => ! prev );

  return (
    <LayoutCtx.Provider
      value= { { sidebarOpen, setSidebarOpen, toggleSidebar } }
    >
      { children }
    </LayoutCtx.Provider>
  );
}

export function useLayout () {
  const context = useContext( LayoutCtx );

  if ( context === undefined ) throw new Error( 'useLayout must be used within a LayoutProvider' );
  return context;
}
