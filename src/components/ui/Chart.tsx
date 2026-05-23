import { formatCurrency, formatPercent } from '@/src/lib/formatter';
import { hasRenderableChildren } from '@/src/lib/utils';
import type { CustomTooltipProps, TooltipRowProps, xAxisIntervalProps, yAxisFormatterProps } from '@/src/types/props';

export const CustomTooltip = ( { label, value, children, color }: CustomTooltipProps ) => {
  return (
    <div className= 'min-w-50 p-4 bg-white border border-slate-200 rounded-xl shadow-md'>
      <p className= 'uppercase font-bold text-sm text-slate-400 tracking-wider'>{ label }</p>
      <div className= 'font-mono text-lg font-semibold' style= { { color } }>
        { value }
      </div>
      { hasRenderableChildren( children ) && (
        <div className= 'space-y-1.5 mt-2 pt-2 text-xs text-slate-500 border-t border-dashed border-slate-300'>
          { children }
        </div>
      ) }
    </div>
  );
};

export const TooltipRow = ( { label, value }: TooltipRowProps ) => {
  return (
    <div className= 'flex justify-between gap-4'>
      <span>{ label }</span>
      <span className= 'font-semibold text-slate-800'>{ value }</span>
    </div>
  );
};

export const yAxisFormatter = ( { type, value, display }: yAxisFormatterProps ) => {
  switch ( type ) {
    case 'currency': return formatCurrency( value, { ...display, decimals: 0 } );
    case 'percent': return formatPercent( value, { ...display, decimals: 0 } );
    default: return String( value );
  }
};

export const xAxisInterval = ( { value, isMobile = false }: xAxisIntervalProps ) => {
  return Math.round( value / 8 ) * ( isMobile ? 0.5 : 1 );
};
