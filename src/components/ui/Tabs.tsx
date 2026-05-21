import { cn } from '@/src/lib/utils';
import type { TabsProps } from '@/src/types/props';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const Tabs = ( { options, activeId, onChange, className }: TabsProps ) => {
  const [ isOpen, setIsOpen ] = useState( false );
  const dropdownRef = useRef < HTMLDivElement > ( null );

  const activeOption = options.find( opt => opt.id === activeId ) || options[ 0 ];

  useEffect( () => {
    const handleClickOutside = ( event: MouseEvent ) => {
      if ( dropdownRef.current && ! dropdownRef.current.contains( event.target as Node ) ) setIsOpen( false );
    };

    document.addEventListener( 'mousedown', handleClickOutside );
    return () => { document.removeEventListener( 'mousedown', handleClickOutside ) };
  }, [] );

  return (
    <div
      ref= { dropdownRef }
      className= { cn( 'relative inline-block w-full md:w-auto', className ) }
    >
      { /** Mobile View */ }
      <div className= 'md:hidden w-full relative'>
        <button
          onClick= { () => setIsOpen( ! isOpen ) }
          className= {
            'flex justify-between items-center gap-3 w-full px-5 py-3 font-bold text-sm text-slate-800 ' +
            'bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition-all'
          }
        >
          <span className= 'flex items-center gap-2 truncate'>
            { activeOption?.icon && <activeOption.icon size={ 16 } className= 'shrink-0 text-primary' /> }
            <span className= 'truncate'>{ activeOption?.label }</span>
          </span>
          { isOpen
            ? <ChevronUp size={ 18 } className= 'shrink-0 text-slate-500' />
            : <ChevronDown size={ 18 } className= 'shrink-0 text-slate-500' />
          }
        </button>

        { isOpen && (
          <div className= {
            'absolute left-0 right-0 flex flex-col gap-1.5 mt-2 p-1.5 bg-white border border-slate-200 ' +
            'rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 z-50'
          }>
            { options.map( opt => (
              <button
                key= { opt.id }
                onClick= { () => {
                  onChange( opt.id );
                  setIsOpen( false );
                } }
                className= { cn(
                  'flex items-center gap-3 w-full px-4 py-2.5 font-bold text-sm rounded-lg transition-all',
                  activeId === opt.id
                    ? 'text-primary bg-slate-50 border border-slate-100/50'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                ) }
              >
                { opt.icon && (
                  <opt.icon
                    className= { cn( activeId === opt.id ? 'text-primary' : 'text-slate-400' ) }
                    size= { 16 }
                  />
                ) }
                <span className= 'truncate'>{ opt.label }</span>
              </button>
            ) ) }
          </div>
        ) }
      </div>

      { /** Desktop View */ }
      <div className={ cn( 'hidden md:inline-flex gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200 shadow-inner' ) }>
        { options.map( opt => (
          <button
            key= { opt.id }
            onClick= { () => onChange( opt.id ) }
            className= { cn(
              'flex justify-center items-center gap-2 px-4 py-2.5 font-bold text-sm rounded-lg transition-all duration-200 outline-none',
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
    </div>
  );
};
