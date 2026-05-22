import type { DisplaySettings } from '@/src/types/data';

function parseValue ( val: any ) : number | null {
  return typeof val === 'string' ? Number( val.replace( /,/g, '.' ) ) : Number( val );
}

export function formatNumber (
  val: any, display?: DisplaySettings,
  options: Intl.NumberFormatOptions = {}
) : string {
  const { language = 'en', decimals = 2 } = display || {};
  const num = parseValue( val );

  if ( num === null || isNaN( num ) ) return '';

  return new Intl.NumberFormat( language === 'de' ? 'de-DE' : 'en-US', {
    minimumFractionDigits: decimals, maximumFractionDigits: decimals, ...options
  } ).format( num );
}

export const formatCurrency = ( val: any, display?: DisplaySettings ) : string => {
  return formatNumber( val, display, { style: 'currency', currency: display?.currency || 'USD' } );
};

export const formatPercent = ( val: any, display?: DisplaySettings ) : string => {
  return formatNumber( val, display, { style: 'percent' } );
};

export const formatUnit = ( unit: string, val: any, display?: DisplaySettings ) : string => {
  return formatNumber( val, display, { style: 'unit', unit } );
};
