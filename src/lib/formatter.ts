import type { DisplaySettings } from '@/src/types/data';

export function formatCurrency ( val: any, display?: DisplaySettings ) : string {
  const parsedVal = typeof val === 'string' ? val.replace( /,/g, '.' ) : val;
  const num = Number( parsedVal );

  if ( isNaN( num ) || val === '' || val === null || val === undefined ) return '';

  const lang = display?.language || 'en';
  const curr = display?.currency || 'USD';
  const decs = display?.decimals !== undefined ? display.decimals : 2;

  return new Intl.NumberFormat( lang === 'de' ? 'de-DE' : 'en-US', {
    style: 'currency',
    currency: curr,
    minimumFractionDigits: decs,
    maximumFractionDigits: decs
  } ).format( num );
}

export function formatPercent ( val: any, display?: DisplaySettings ) : string {
  const parsedVal = typeof val === 'string' ? val.replace( /,/g, '.' ) : val;
  const num = Number( parsedVal );

  if ( isNaN( num ) || val === '' || val === null || val === undefined ) return '';

  const lang = display?.language || 'en';
  const decs = display?.decimals !== undefined ? display.decimals : 2;

  return new Intl.NumberFormat( lang === 'de' ? 'de-DE' : 'en-US', {
    style: 'percent',
    minimumFractionDigits: decs,
    maximumFractionDigits: decs
  } ).format( num );
}
