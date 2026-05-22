import { cn } from '@/src/lib/utils';
import type { CardProps, InfoCardProps } from '@/src/types/props';

export const Card = ( { children, className }: CardProps ) => {
  return (
    <div className= { cn( 'p-4 sm:p-6 md:p-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm transition-all', className ) }>
      { children }
    </div>
  );
};

export const InfoCard = ( { label, value } : InfoCardProps ) => {
  return (
    <Card className= 'p-4 sm:p-6 min-w-0 overflow-hidden'>
      <div className= 'mb-1 truncate uppercase text-[10px] sm:text-xs font-bold tracking-wider text-slate-400' title= { label }>
        { label }
      </div>
      <div className= 'truncate font-mono text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900' title= { value }>
        { value }
      </div>
    </Card>
  );
};
