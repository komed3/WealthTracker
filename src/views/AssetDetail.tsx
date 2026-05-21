import { Card } from '@/src/components/ui/Card';
import { Heading } from '@/src/components/ui/Heading';
import { Icon } from '@/src/components/ui/Icon';
import type { ASSET_CLASS, LIABILITY_CLASS } from '@/src/config/constants';
import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import { formatCurrency, formatPercent } from '@/src/lib/formatter';
import i18n from '@/src/lib/i18n';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ResponsiveContainer } from 'recharts';

export const AssetDetail = () => {
  const { assetId } = useParams < { assetId: string } > ();
  const navigate = useNavigate();
  const { setTitle } = useLayout();

  const { data, settings } = useData();
  const assetData = data?.entries.filter( r => r.entry.id === assetId )[ 0 ];
  const display = settings!.display;

  useEffect( () => { if ( ! assetId || ! assetData ) navigate( '/assets', { replace: true } ) }, [ assetId, navigate ] );
  if ( ! assetId || ! assetData ) return null;

  useEffect( () => { setTitle( assetData.entry.title ) }, [ setTitle, display.language ] );

  const sortedYears = useMemo(
    () => Object.values( data.computed.years ?? [] ).map( s => s.year ).sort( ( a, b ) => a - b ),
    [ data ]
  );

  const lastYear = sortedYears[ sortedYears.length - 1 ];
  const entryStats = useMemo( () => data.computed.entries[ assetData.entry.id ], [ data ] );
  const currentAbs = entryStats?.latestValue ?? 0;
  const currentRel = entryStats?.relativeHistory?.[ String( lastYear ) as `${number}` ] ?? 0;

  const { mainChartData, growthChartData, hasMinMax } = useMemo( () => {
    let checkMinMax = false;

    const mainDetails = sortedYears.map( yearKey => {
      const yearStr = String( yearKey ) as `${number}`;
      const h = assetData.history[ yearStr ];
      const valueVal = h?.value ?? 0;
      const minVal = h?.min ?? valueVal;
      const maxVal = h?.max ?? valueVal;

      if ( minVal !== valueVal || maxVal !== valueVal ) checkMinMax = true;

      return {
        year: yearKey, value: valueVal, min: minVal, max: maxVal,
        confidence: h?.confidence || 'medium'
      };
    } );

    const growthDetails = sortedYears.map( ( year, index ) => {
      const prevYrStr = String( sortedYears[ index - 1 ] ) as `${number}`;
      const currYrStr = String( year ) as `${number}`;
      const prevVal = assetData.history[ prevYrStr ]?.value ?? 0;
      const currVal = assetData.history[ currYrStr ]?.value ?? 0;
      const change = prevVal !== 0 ? ( ( currVal - prevVal ) / prevVal ) * 100 : 0;

      return { year, change };
    } ).slice( 1 );

    return {
      mainChartData: mainDetails,
      growthChartData: growthDetails,
      hasMinMax: checkMinMax
    };
  }, [ assetData, sortedYears ] );

  const classLabel = useMemo( () => {
    return assetData.entry.category === 'asset'
      ? i18n.t( $ => $.assetClass[ assetData.entry.class as ASSET_CLASS ] )
      : i18n.t( $ => $.liabilityClass[ assetData.entry.class as LIABILITY_CLASS ] );
  }, [ assetData, display.language ] );

  return (
    <div className= 'space-y-8'>
      { /** Page Header */ }
      <div className= 'flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pb-6 border-b border-slate-200'>
        { /** Asset Title */ }
        <div className= 'flex items-center gap-4 min-w-0'>
          <Link
            to= '/assets'
            className= {
              'flex justify-center items-center shrink-0 w-10 h-10 text-slate-500 hover:text-slate-800 ' +
              'bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all'
            }>
              <ArrowLeft size= { 20 } />
          </Link>
          <div
            className= 'flex justify-center items-center shrink-0 w-12 h-12 sm:w-14 sm:h-14 text-white rounded-xl'
            style= { { backgroundColor: assetData.entry.color } }
          >
            <Icon name= { assetData.entry.icon } size= { 24 } />
          </div>
          <div className= 'flex flex-col justify-center gap-1 min-w-0'>
            <Heading level= { 1 } className= 'truncate leading-tight text-xl sm:text-2xl font-bold tracking-tight text-slate-900'>
              { assetData.entry.title }
            </Heading>
            <p className= 'truncate uppercase tracking-wider text-xs font-medium text-slate-400'>
              { i18n.t( $ => $.category[ assetData.entry.category ] ) } — { classLabel }
            </p>
          </div>
        </div>

        { /** Asset Value */ }
        <div className= 'flex justify-between sm:justify-end items-center gap-6 sm:gap-8 w-full sm:w-auto text-right'>
          <div className= 'flex flex-col items-start sm:items-end'>
            <span className= 'leading-none font-mono text-xl sm:text-2xl font-bold text-slate-900'>
              { formatCurrency( currentAbs, display ) }
            </span>
            <span className= 'mt-1.5 uppercase tracking-wider text-xs font-medium text-slate-400'>
              { i18n.t( $ => $.assetDetail.value ) }
            </span>
          </div>

          <div className= 'flex flex-col items-end'>
            <span className= 'font-mono text-xl sm:text-2xl font-bold leading-none'>
              { formatPercent( currentRel, display ) }
            </span>
            <span className= 'mt-1.5 uppercase tracking-wider text-xs font-medium text-slate-400'>
              { i18n.t( $ => $.assetDetail.share ) }
            </span>
          </div>
        </div>
      </div>

      { /** Content */ }
      <div className= 'flex flex-col 2xl:flex-row items-start gap-8'>
        { /** Charts */ }
        <div className= 'flex-1'>
          { /** History */ }
          <Card>
            <Heading level= { 4 }>
              { i18n.t( $ => $.assetDetail.history ) }
            </Heading>
            <ResponsiveContainer width= '100%' height= { 320 }>
              //
            </ResponsiveContainer>
          </Card>
        </div>

        { /** Infos */ }
        <div className= 'shrink-0 w-sm'>
          ...
        </div>
      </div>
    </div>
  );
};
