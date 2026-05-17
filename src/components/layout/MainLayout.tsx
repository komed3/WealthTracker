import { Sidebar } from '@/src/components/layout/Sidebar';
import type { LayoutProps } from '@/src/types/props';

export const MainLayout = ( { children }: LayoutProps ) => {
  return (
    <div className= 'flex flex-col min-h-screen'>
      <Sidebar />
      { children }
    </div>
  );
};
