import { cn } from '@/src/lib/utils';
import type { TabsProps } from '@/src/types/props';

export const Tabs = ( { options, activeId, onChange, className }: TabsProps ) => {
  return (
    <div className={ cn( 'inline-flex gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200 shadow-inner', className ) }>
      { options.map( opt => (
        <button
          key= { opt.id }
          onClick= { () => onChange( opt.id ) }
          className= { cn(
            'flex justify-center items-center gap-2 px-6 py-2.5 font-bold text-sm rounded-lg transition-all duration-200 outline-none',
            activeId === opt.id
              ? 'text-primary bg-white shadow-sm ring-1 ring-slate-200/50'
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
          ) }
        >
          { opt.icon && <opt.icon size={ 16 } /> }
          { opt.label }
        </button>
      ) ) }
    </div>
  );
};
