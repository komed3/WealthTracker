import { cn } from '@/src/lib/utils';
import type { HeadingProps } from '@/src/types/props';

export const Heading = ( { children, level = 1, className }: HeadingProps ) => {
  const Tag = `h${ level }` as const;
  const styles = {
    1: 'font-display font-bold text-3xl md:text-4xl tracking-tight text-slate-900',
    2: 'font-display font-semibold text-2xl md:text-3xl tracking-tight text-slate-900',
    3: 'font-display font-semibold text-xl text-slate-900',
    4: 'font-display font-medium text-lg text-slate-800'
  };

  return (
    <Tag className= { cn( styles[ level ], className ) }>
      { children }
    </Tag>
  );
};
