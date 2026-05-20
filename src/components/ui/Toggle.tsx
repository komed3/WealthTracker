import { cn } from '@/src/lib/utils';
import { ToggleProps } from '@/src/types/props';

export const Toggle = ( { label, checked, onChange, disabled, className }: ToggleProps ) => {
  return (
    <button
      type= 'button'
      aria-pressed= { checked }
      disabled= { disabled }
      onClick= { () => ! disabled && onChange( ! checked ) }
      className= { cn(
        'flex justify-between items-center gap-3 w-full p-3 text-left text-slate-800 bg-white',
        'rounded-xl transition-all duration-200',
        disabled && 'cursor-not-allowed opacity-60',
        className
      ) }
    >
      <span className= 'text-sm font-medium'>
        { label }
      </span>
      <span className= { cn(
        'relative inline-flex items-center shrink-0 w-11 h-6 rounded-full transition-colors duration-200',
        checked ? 'bg-primary' : 'bg-slate-200'
      ) }>
        <span className= { cn(
          'absolute left-0.5 inline-block w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-0'
        ) } />
      </span>
    </button>
  );
};
