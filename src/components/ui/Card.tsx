import type { CardProps } from '@/src/types/props';
import { cn } from '@/src/lib/utils';

export const Card = ( { children, className }: CardProps ) => {
  return (
    <div className= { cn( 'p-6 md:p-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm transition-all', className ) }>
      { children }
    </div>
  );
};
