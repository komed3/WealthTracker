import { useData } from '@/src/context/DataCtx';
import { formatCurrency, formatPercent } from '@/src/lib/formatter';
import type { CustomTooltipProps, yAxisFormatterProps } from '@/src/types/props';

export const CustomTooltip = ( { label, value, children, color }: CustomTooltipProps ) => {
  return (
    <div className= 'min-w-50 p-4 bg-white border border-slate-200 rounded-xl shadow-md'>
      <p className= 'uppercase font-bold text-sm text-slate-400 tracking-wider'>{ label }</p>
      <div className= 'font-mono text-lg font-bold' style= { { color } }>
        { value }
      </div>
      { children && (
        <div className= 'space-y-1.5 mt-2 pt-2 text-xs text-slate-500 border-t border-dashed border-slate-300'>
          { children }
        </div>
      ) }
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
