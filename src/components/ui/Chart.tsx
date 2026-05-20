import { useData } from '@/src/context/DataCtx';
import { formatCurrency, formatPercent } from '@/src/lib/formatter';
import type { yAxisFormatterProps } from '@/src/types/props';

export const CustomTooltip = () => {
  return ( <></> );
};

export const yAxisFormatter = ( { type, value }: yAxisFormatterProps ) => {
  const { settings } = useData();

  switch ( type ) {
    case 'currency': return formatCurrency( value, { ...settings!.display, decimals: 0 } );
    case 'percent': return formatPercent( value, { ...settings!.display, decimals: 0 } );
    default: return String( value );
  }
};
