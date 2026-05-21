import { Card } from '@/src/components/ui/Card';
import { CustomTooltip, yAxisFormatter } from '@/src/components/ui/Chart';
import { Heading } from '@/src/components/ui/Heading';
import { Icon } from '@/src/components/ui/Icon';
import type { ASSET_CLASS, CONFIDENCE, LIABILITY_CLASS } from '@/src/config/constants';
import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import { formatCurrency, formatPercent } from '@/src/lib/formatter';
import i18n from '@/src/lib/i18n';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Area, Bar, BarChart, CartesianGrid, ComposedChart, Line, Rectangle, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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

  const { mainChartData, growthChartData } = useMemo( () => {
    let hasValue = false;

    const mainChartData = sortedYears.map( yearKey => {
      const year = String( yearKey );
      const h = assetData.history[ year as `${number}` ];
      const value = h?.value ?? 0;
      const min = h?.min ?? value;
      const max = h?.max ?? value;

      if ( ! hasValue && value === 0 ) return;
      hasValue = true;

      return {
        year, value, min: min, max: max, range: [ min, max ],
        confidence: h?.confidence || 'medium'
      };
    } ).filter( Boolean );

    const growthChartData = mainChartData.map( ( row, index ) => {
      return {
        year: row!.year,
        change: index === 0 ? 0 : (
          row!.value - mainChartData[ index - 1 ]!.value
        ) / Math.abs(
          mainChartData[ index - 1 ]!.value
        )
      };
    } ).slice( 1 );

    return { mainChartData, growthChartData };
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
        <div className= 'flex-1 space-y-8'>
          { /** Historical Trend */ }
          <Card>
            <Heading level= { 4 } className= 'mb-6'>
              { i18n.t( $ => $.assetDetail.history ) }
            </Heading>
            <ResponsiveContainer width= '100%' height= { 320 }>
              <ComposedChart
                data= { mainChartData }
                margin= { { top: 10, right: 20, left: 20, bottom: 10 } }
              >
                <CartesianGrid
                  strokeDasharray= '3 3'
                  stroke= '#f1f5f9'
                  vertical= { false }
                />
                <XAxis
                  dataKey= 'year'
                  interval= { 3 }
                  stroke= '#94a3b8'
                  fontSize= { 12 }
                  fontWeight= { 600 }
                  tickLine= { false }
                  axisLine= { false }
                  dy= { 10 }
                />
                <YAxis
                  tickFormatter= { ( value: number ) => yAxisFormatter( {
                    type: 'currency', value, display
                  } ) }
                  stroke= '#94a3b8'
                  fontSize= { 12 }
                  fontWeight= { 600 }
                  tickLine= { false }
                  axisLine= { false }
                  dx= { -10 }
                />
                <Tooltip
                  content= { ( { active, payload } ) => {
                    if ( active && payload && payload.length ) {
                      const dataPoint = payload[ 0 ].payload;

                      return (
                        <CustomTooltip
                          label= { String( dataPoint.year ) }
                          value= { formatCurrency( dataPoint.value, display ) }
                          color= '#2563eb'
                        >
                          <div className= 'flex justify-between gap-4'>
                            <span>{ i18n.t( $ => $.assetDetail.maximum ) }</span>
                            <span className= 'font-mono font-semibold text-slate-800'>
                              { formatCurrency( dataPoint.max, display ) }
                            </span>
                          </div>
                          <div className= 'flex justify-between gap-4'>
                            <span>{ i18n.t( $ => $.assetDetail.minimum ) }</span>
                            <span className= 'font-mono font-semibold text-slate-800'>
                              { formatCurrency( dataPoint.min, display ) }
                            </span>
                          </div>
                          <div className= 'flex justify-between gap-4'>
                            <span>{ i18n.t( $ => $.assetDetail.confidence ) }</span>
                            <span className= 'font-mono font-semibold text-slate-800'>
                              { i18n.t( $ => $.confidence[ dataPoint.confidence as CONFIDENCE ] ) }
                            </span>
                          </div>
                        </CustomTooltip>
                      );
                    }
                  } }
                  cursor= { { stroke: '#cbd5e1', strokeWidth: 0.5 } }
                />
                <ReferenceLine
                  y= { 0 }
                  stroke= '#cbd5e1'
                  strokeWidth= { 1 }
                  style= { { opacity: 0.6 } }
                />
                <Area
                  type= 'monotone'
                  dataKey= 'range'
                  fill= '#2563eb'
                  fillOpacity= { 0.08 }
                  stroke= 'none'
                  activeDot= { false }
                />
                <Line
                  type= 'monotone'
                  dataKey= 'max'
                  stroke= '#2563eb'
                  strokeOpacity= { 0.25 }
                  strokeWidth= { 1 }
                  strokeDasharray= '4 4'
                  dot= { false }
                  activeDot= { false }
                />
                <Line
                  type= 'monotone'
                  dataKey= 'min'
                  stroke= '#2563eb'
                  strokeOpacity= { 0.25 }
                  strokeWidth= { 1 }
                  strokeDasharray= '4 4'
                  dot= { false }
                  activeDot= { false }
                />
                <Line
                  type= 'monotone'
                  dataKey= 'value'
                  stroke= '#2563eb'
                  strokeWidth= { 3 }
                  dot= { {
                    stroke: '#2563eb',
                    strokeWidth: 2,
                    fill: '#fff',
                    r: 5,
                    fillOpacity: 1
                  } }
                  activeDot= { {
                    stroke: '#2563eb',
                    strokeWidth: 3,
                    fill: '#fff',
                    r: 7,
                    fillOpacity: 1
                  } }
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Card>

          { /** YoY Pct Growth */ }
          <Card>
            <Heading level= { 4 } className= 'mb-6'>
              { i18n.t( $ => $.assetDetail.growth ) }
            </Heading>
            <ResponsiveContainer width= '100%' height= { 220 }>
              <BarChart
                data= { growthChartData }
                margin= { { top: 10, right: 20, left: 20, bottom: 10 } }
              >
                <XAxis
                  dataKey= 'year'
                  interval= { 3 }
                  stroke= '#94a3b8'
                  fontSize= { 12 }
                  fontWeight= { 600 }
                  tickLine= { false }
                  axisLine= { false }
                  dy= { 10 }
                />
                <YAxis
                  tickFormatter= { ( value: number ) => yAxisFormatter( {
                    type: 'percent', value, display
                  } ) }
                  stroke= '#94a3b8'
                  fontSize= { 12 }
                  fontWeight= { 600 }
                  tickLine= { false }
                  axisLine= { false }
                  dx= { -10 }
                />
                <Tooltip
                  content= { ( { active, payload } ) => {
                    if ( active && payload && payload.length ) {
                      const dataPoint = payload[ 0 ].payload;
                      const isPositive = dataPoint.change >= 0;

                      return (
                        <CustomTooltip
                          label= { dataPoint.year }
                          value= { formatPercent( Math.abs( dataPoint.change ), display ) }
                          color= { isPositive ? '#10b981' : '#ef4444' }
                        />
                      );
                    }
                  } }
                  cursor= { { fill: 'oklch(98.4% 0.003 247.858)' } }
                />
                <ReferenceLine
                  y= { 0 }
                  stroke= '#cbd5e1'
                  strokeWidth= { 2 }
                  strokeDasharray= { 5 }
                  style={ { opacity: 0.6 } }
                />
                <Bar
                  dataKey= 'change'
                  shape={ ( props ) => {
                    const { payload } = props;
                    const isPositive = payload.change >= 0;

                    return (
                      <Rectangle
                        { ...props }
                        className= 'transition-all duration-300'
                        fill= { isPositive ? '#10b981' : '#ef4444' }
                        radius= { [ 4, 4, 0, 0 ] }
                      />
                    );
                  } }
                />
              </BarChart>
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
