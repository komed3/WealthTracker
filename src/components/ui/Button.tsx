import type { ButtonProps } from '@/src/types/props';
import { cn } from '@/src/lib/utils';

export const Button = ( { children, variant = 'primary', size = 'md', className, ...props }: ButtonProps ) => {
  const baseStyle = 'inline-flex justify-center items-center font-medium rounded-xl transition-all duration-200 focus:outline-none ' +
    'focus:ring-2 focus:ring-primary/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'text-white bg-primary hover:bg-primary/95 shadow-sm shadow-primary/10',
    secondary: 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200/50',
    ghost: 'text-slate-500 hover:text-slate-900 hover:bg-slate-50',
    danger: 'text-white bg-red-500 hover:bg-red-600 shadow-sm shadow-red-500/10'
  };

  const sizes = {
    sm: 'gap-1.5 h-9 px-3.5 text-sm',
    md: 'gap-2 h-11 px-5 text-base',
    lg: 'gap-2.5 h-12 px-7 text-lg'
  };

  return (
    <button
      className= { cn( baseStyle, variants[ variant ], sizes[ size ], className ) }
      { ...props }
    >
      { children }
    </button>
  );
};
