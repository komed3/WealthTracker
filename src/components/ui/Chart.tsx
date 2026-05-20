import { useData } from '@/src/context/DataCtx';
import { formatCurrency, formatPercent } from '@/src/lib/formatter';
import type { CustomTooltipProps, yAxisFormatterProps } from '@/src/types/props';

export const CustomTooltip = ( { label }: CustomTooltipProps ) => {
  return (
    <div className= 'min-w-50 p-4 bg-white border border-slate-200 rounded-xl shadow-md'>
      <p className= 'mb-1 uppercase font-bold text-xs text-slate-400 tracking-widest'>{ label }</p>
    </div>
  );
};

export const yAxisFormatter = ( { type, value }: yAxisFormatterProps ) => {
  const { settings } = useData();

  switch ( type ) {
    case 'currency': return formatCurrency( value, { ...settings!.display, decimals: 0 } );
    case 'percent': return formatPercent( value, { ...settings!.display, decimals: 0 } );
    default: return String( value );
  }
};
