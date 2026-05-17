import type React from 'react';

export interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ( { children }: MainLayoutProps ) => {
  return ( <>{ children }</> );
};
