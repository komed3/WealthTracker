import { useState } from 'react';
import { Calendar } from 'lucide-react';

import type { InputProps } from '@/src/types/props';
import { useData } from '@/src/context/DataCtx';
import { formatCurrency } from '@/src/lib/formatter';
import { cn } from '@/src/lib/utils';

export const Input = ( {
  label, error, className, type = 'text', isCurrency,
  value, onChange, onFocus, onBlur, ...props
}: InputProps ) => {
  const { settings } = useData();
  const [ isFocused, setIsFocused ] = useState( false );
  const isDate = type === 'date';
  const isNumeric = type === 'number' || isCurrency;

  const handleFocus = ( e: React.FocusEvent < HTMLInputElement > ) => {
    setIsFocused( true );
    if ( onFocus ) onFocus( e );
  };

  const handleBlur = ( e: React.FocusEvent < HTMLInputElement > ) => {
    setIsFocused( false );
    if ( onBlur ) onBlur( e );
  };

  const handleChange = ( e: React.ChangeEvent < HTMLInputElement > ) => {
    if ( isNumeric ) {
      let val = e.target.value.replace( /,/g, '.' );

      const isNegative = val.startsWith( '-' );
      let clean = val.replace( /[^0-9.]/g, '' );

      const dotIndex = clean.indexOf( '.' );

      if ( dotIndex !== -1 ) {
        const beforeDot = clean.slice( 0, dotIndex + 1 );
        const afterDot = clean.slice( dotIndex + 1 ).replace( /\./g, '' );
        clean = beforeDot + afterDot;
      }

      val = ( isNegative ? '-' : '' ) + clean;
      e.target.value = val;
    }

    if ( onChange ) onChange( e );
  };

  const inputType = isNumeric ? 'text' : type;
  const inputMode = isNumeric ? 'decimal' : undefined;
  const inputValue = isCurrency && ! isFocused ? formatCurrency( value, settings?.display ) : value;

  return (
    <div className= 'relative flex flex-col gap-2 w-full'>
      { label && (
        <label className= 'text-sm font-medium text-slate-600'>
          { label }
        </label>
      ) }
      <div className= 'relative w-full'>
        <input
          type= { inputType }
          inputMode= { inputMode }
          value= { inputValue ?? '' }
          onChange= { handleChange }
          onFocus= { handleFocus }
          onBlur= { handleBlur }
          className= { cn(
            'w-full h-11 px-4 text-slate-800 placeholder:text-slate-400 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200',
            isDate && 'pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-y-0 [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer',
            isCurrency && ! isFocused && 'font-semibold text-primary',
            isNumeric && 'font-mono tracking-tight',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
            className
          ) }
          { ...props }
        />
        { isDate && (
          <div className= 'absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 pointer-events-none'>
            <Calendar size= { 18 } />
          </div>
        ) }
      </div>
      { error && (
        <span className= 'text-xs font-medium text-red-500'>
          { error }
        </span>
      ) }
    </div>
  );
};
