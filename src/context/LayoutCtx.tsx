import { createContext, useContext, useState } from 'react';
import { MainLayoutProps } from '../components/layout/MainLayout';

export interface LayoutCtxType {
  sidebarOpen: boolean;
  setSidebarOpen: ( open: boolean ) => void;
  toggleSidebar: () => void;
}

const LayoutCtx = createContext< LayoutCtxType | undefined >( undefined );

export function LayoutProvider ( { children }: MainLayoutProps ) {
  const [ sidebarOpen, setSidebarOpen ] = useState( true );
  const toggleSidebar = () => setSidebarOpen( prev => ! prev );

  return (
    <LayoutCtx.Provider
      value={ { sidebarOpen, setSidebarOpen, toggleSidebar } }
    >
      { children }
    </LayoutCtx.Provider>
  );
}
