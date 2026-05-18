import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/src/lib/utils';
import type { SelectProps } from '@/src/types/props';

export const Select = ( { label, error, value, options, onChange, className }: SelectProps ) => {
  const [ isOpen, setIsOpen ] = useState( false );
  const dropdownRef = useRef < HTMLDivElement > ( null );

  const selectedOption = options.find( opt => opt.value === value ) || options[ 0 ];

  const handleSelect = ( optValue: string | number ) => {
    if ( onChange ) onChange( { target: { value: String( optValue ) } } );
    setIsOpen( false );
  };

  useEffect( () => {
    const handleClickOutside = ( event: MouseEvent ) => {
      if ( dropdownRef.current && ! dropdownRef.current.contains( event.target as Node ) ) setIsOpen( false );
    };

    document.addEventListener( 'mousedown', handleClickOutside );
    return () => document.removeEventListener( 'mousedown', handleClickOutside );
  }, [] );

  return (
    <div className= 'relative flex flex-col gap-2 w-full' ref= { dropdownRef }>
      { label && (
        <label className= 'text-sm font-medium text-slate-600'>
          { label }
        </label>
      ) }

      <div className= 'relative w-full'>
        <button
          type= 'button'
          onClick= { () => setIsOpen( prev => ! prev ) }
          className= { cn(
            'flex justify-between items-center w-full h-11 px-4 text-left text-slate-800 bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all',
            isOpen && 'border-primary ring-2 ring-primary/10',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
            className
          ) }
        >
          <span className= 'truncate font-medium'>
            { selectedOption?.label }
          </span>
          <ChevronDown
            className= { cn(
              'h-4 w-4 text-slate-500 transition-transform duration-200',
              isOpen && 'text-primary rotate-180'
            ) }
          />
        </button>

        <AnimatePresence>
          { isOpen && (
            <motion.div
              initial= { { opacity: 0, y: -4, scale: 0.98 } }
              animate= { { opacity: 1, y: 0, scale: 1 } }
              exit= { { opacity: 0, y: -4, scale: 0.98 } }
              transition= { { duration: 0.15, ease: 'easeOut' } }
              className= 'absolute max-h-60 mt-2 w-full bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl overflow-y-auto z-50'
            >
              <div className= 'p-1.5 space-y-0.5'>
                { options.map( opt => {
                  const isSelected = opt.value === value;

                  return (
                    <button
                      key= { opt.value }
                      type= 'button'
                      onClick= { () => handleSelect( opt.value ) }
                      className= { cn(
                        'flex justify-between items-center w-full h-10 px-3 text-left text-sm font-medium rounded-lg transition-all',
                        isSelected
                          ? 'text-primary bg-primary/5'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      ) }
                    >
                      <span>{ opt.label }</span>
                      { isSelected && (
                        <div className= 'h-1.5 w-1.5 bg-primary rounded-full' />
                      ) }
                    </button>
                  );
                } ) }
              </div>
            </motion.div>
          ) }
        </AnimatePresence>
      </div>

      { error && (
        <span className= 'text-xs font-medium text-red-500'>
          { error }
        </span>
      ) }
    </div>
  );
};
