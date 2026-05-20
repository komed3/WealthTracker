import { cn } from '@/src/lib/utils';
import type { CardProps, InfoCardProps } from '@/src/types/props';

export const Card = ( { children, className }: CardProps ) => {
  return (
    <div className= { cn( 'p-6 md:p-8 bg-white border border-slate-200/80 rounded-2xl shadow-sm transition-all', className ) }>
      { children }
    </div>
  );
};

export const InfoCard = ( { label, value } : InfoCardProps ) => {
  return (
    <Card>
      <div className= 'mb-2 uppercase text-xs font-bold text-slate-400 tracking-wider'>
        { label }
      </div>
      <div className= 'font-mono text-3xl font-bold text-slate-900'>
        { value }
      </div>
    </Card>
  );
};
