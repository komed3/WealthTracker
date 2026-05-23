import { Card, InfoCard } from '@/src/components/ui/Card';
import { CustomTooltip, TooltipRow, xAxisInterval, yAxisFormatter } from '@/src/components/ui/Chart';
import { Heading } from '@/src/components/ui/Heading';
import { NoData } from '@/src/components/ui/NoData';
import { useData } from '@/src/context/DataCtx';
import { useIsMobile, useLayout } from '@/src/context/LayoutCtx';
import { formatCurrency, formatPercent, formatUnit } from '@/src/lib/formatter';
import i18n from '@/src/lib/i18n';
import { cn } from '@/src/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import {
  Area, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from 'recharts';

export const Dashboard = () => {
  const { settings, data } = useData();
  const { setTitle } = useLayout();
  const isMobile = useIsMobile();
  const display = settings!.display;

  useEffect( () => { setTitle( i18n.t( $ => $.dashboard.title ) ) }, [ setTitle, display.language ] );

  const portfolioStats = data?.computed?.portfolio;
  const hasData = data && Object.keys( data.computed.years ).length;

  if ( ! hasData ) return <NoData />;

  const snapshots = useMemo( () => (
    Object.values( data?.computed.years ?? {} ).sort( ( a, b ) => a.year - b.year )
  ), [ data ] );

  const yearDetails = useMemo( () => snapshots.map( ( s ) => {
    const netWorth = s.netWorth;
    const minNetWorth = s.minNetWorth ?? s.netWorth;
    const maxNetWorth = s.maxNetWorth ?? s.netWorth;
    const real = s.realization?.real.value ?? s.assets ?? s.netWorth;
    const assets = s.assets ?? 0;
    const liabilities = ( s.liabilities ?? 0 ) * -1;

    return {
      ...s, netWorth, minNetWorth, maxNetWorth, real, assets,
      liabilities, range: [ minNetWorth, maxNetWorth ]
    };
  } ), [ snapshots ] );

  const latest = useMemo( () => yearDetails.slice().reverse()[ 0 ], [ yearDetails ] );

  const [ visibleSeries, setVisibleSeries ] = useState( {
    netWorth: true, range: true, assets: true, liabilities: true, real: true
  } );

  const toggleSeries = ( key: keyof typeof visibleSeries ) => {
    setVisibleSeries( prev => ( { ...prev, [ key ]: ! prev[ key ] } ) );
  };

  const legendItems = useMemo( () => [ {
    key: 'netWorth' as const,
    label: i18n.t( $ => $.dashboard.netWorth ),
    color: '#2563eb'
  }, {
    key: 'range' as const,
    label: i18n.t( $ => $.dashboard.range ),
    color: '#3b82f6'
  }, {
    key: 'assets' as const,
    label: i18n.t( $ => $.momentum.assets ),
    color: '#10b981'
  }, {
    key: 'liabilities' as const,
    label: i18n.t( $ => $.dashboard.liabilities ),
    color: '#ef4444'
  }, {
    key: 'real' as const,
    label: i18n.t( $ => $.dashboard.real ),
    color: '#8884d8'
  } ], [ display.language ] );

  return (
    <div className= 'space-y-8'>
      { /** Key Metrics */ }
      { portfolioStats && latest && (
        <div className= 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full'>
          <InfoCard
            label= { i18n.t( $ => $.dashboard.netWorth ) }
            value= { formatCurrency( portfolioStats.latestNetWorth, display ) }
          />
          <InfoCard
            label= { i18n.t( $ => $.dashboard.assets ) }
            value= { formatCurrency( latest.assets, display ) }
          />
          <InfoCard
            label= { i18n.t( $ => $.dashboard.liabilities ) }
            value= { formatCurrency( Math.abs( latest.liabilities ), display ) }
          />
          <InfoCard
            label= { i18n.t( $ => $.dashboard.avgGrowth ) }
            value= {
              portfolioStats.averageAnnualGrowth !== undefined
                ? formatPercent( portfolioStats.averageAnnualGrowth, display )
                : '—'
            }
          />
        </div>
      ) }

      { /** Wealth Timeline */ }
      <Card className= 'flex flex-col gap-6'>
        <div className= 'flex flex-col gap-1.5 mb-4'>
          <Heading level= { 3 }>
            { i18n.t( $ => $.dashboard.chartTitle ) }
          </Heading>
          <p className= 'text-sm text-slate-500'>
            { i18n.t( $ => $.dashboard.chartSubtitle ) }
          </p>
        </div>

        <ResponsiveContainer width= '100%' aspect= { 1.8 } maxHeight= { 460 }>
          <ComposedChart
            data= { yearDetails }
            margin= { { top: 10, right: 20, left: 20, bottom: 10 } }
          >
              <CartesianGrid
                strokeDasharray= '3 3'
                stroke= '#f1f5f9'
                vertical= { false }
              />
              <XAxis
                dataKey= 'year'
                interval= { xAxisInterval( { value: yearDetails.length, isMobile } ) }
                stroke= '#94a3b8'
                fontSize= { 12 }
                fontWeight= { 600 }
                tickLine= { false }
                axisLine= { false }
                dy= { 10 }
              />
              <YAxis
                hide= { isMobile }
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
                        value= { visibleSeries.netWorth ? formatCurrency( dataPoint.netWorth, display ) : undefined }
                        color= '#2563eb'
                      >
                        { visibleSeries.range && dataPoint.maxNetWorth !== dataPoint.netWorth && (
                          <TooltipRow
                            label= { i18n.t( $ => $.dashboard.maximum ) }
                            value= { formatCurrency( dataPoint.maxNetWorth, display ) }
                          />
                        ) }
                        { visibleSeries.range && dataPoint.minNetWorth !== dataPoint.netWorth && (
                          <TooltipRow
                            label= { i18n.t( $ => $.dashboard.minimum ) }
                            value= { formatCurrency( dataPoint.minNetWorth, display ) }
                          />
                        ) }
                        { visibleSeries.assets && dataPoint.assets !== 0 && (
                          <TooltipRow
                            label= { i18n.t( $ => $.dashboard.assets ) }
                            value= { formatCurrency( dataPoint.assets, display ) }
                          />
                        ) }
                        { visibleSeries.liabilities && dataPoint.liabilities !== 0 && (
                          <TooltipRow
                            label= { i18n.t( $ => $.dashboard.liabilities ) }
                            value= { formatCurrency( Math.abs( dataPoint.liabilities ), display ) }
                          />
                        ) }
                        { visibleSeries.real && dataPoint.real !== dataPoint.netWorth && (
                          <TooltipRow
                            label= { i18n.t( $ => $.dashboard.real ) }
                            value= { formatCurrency( dataPoint.real, display ) }
                          />
                        ) }
                      </CustomTooltip>
                    );
                  }
                } }
                cursor= { { stroke: '#cbd5e1', strokeWidth: 0.5 } }
              />
              <ReferenceLine
                y= { 0 }
                stroke= '#cbd5e1'
                strokeWidth= { 2 }
                style= { { opacity: 0.6 } }
              />

              <defs>
                <linearGradient id= 'gradient-assets' x1= '0' y1= '0' x2= '0' y2= '1'>
                  <stop offset= '0%' stopColor= '#10b981' stopOpacity= { 1 } />
                  <stop offset= '100%' stopColor= '#10b981' stopOpacity= { 0 } />
                </linearGradient>
                <linearGradient id= 'gradient-liabilities' x1= '0' y1= '0' x2= '0' y2= '1'>
                  <stop offset= '0%' stopColor= '#ef4444' stopOpacity= { 0 } />
                  <stop offset= '100%' stopColor= '#ef4444' stopOpacity= { 1 } />
                </linearGradient>
                <pattern
                  id= 'pattern-real'
                  width= { 6 }
                  height= { 6 }
                  patternUnits= 'userSpaceOnUse'
                  patternTransform= 'rotate(45)'
                >
                  <line
                    x1= { 0 } y= { 0 } x2= { 0 } y2= { 6 }
                    stroke= '#8884d8'
                    strokeWidth= { 2 }
                  />
                </pattern>
              </defs>

              { visibleSeries.range && ( <>
                <Area
                  type= 'monotone'
                  dataKey= 'range'
                  fill= '#2563eb'
                  fillOpacity= { 0.15 }
                  stroke= 'none'
                  activeDot= { false }
                />
                <Line
                  type= 'monotone'
                  dataKey= 'maxNetWorth'
                  stroke= '#2563eb'
                  strokeOpacity= { 0.35 }
                  strokeWidth= { 1 }
                  strokeDasharray= '4 4'
                  dot= { false }
                  activeDot= { false }
                />
                <Line
                  type= 'monotone'
                  dataKey= 'minNetWorth'
                  stroke= '#2563eb'
                  strokeOpacity= { 0.35 }
                  strokeWidth= { 1 }
                  strokeDasharray= '4 4'
                  dot= { false }
                  activeDot= { false }
                />
              </> ) }

              { visibleSeries.assets && (
                <Area
                  type= 'monotone'
                  dataKey= 'assets'
                  fill= 'url(#gradient-assets)'
                  fillOpacity= { 0.2 }
                  stroke= '#10b981'
                  strokeOpacity= { 0.5 }
                  strokeWidth= { 1 }
                  dot= { false }
                  activeDot= { false }
                />
              ) }

              { visibleSeries.liabilities && (
                <Area
                  type= 'monotone'
                  dataKey= 'liabilities'
                  fill= 'url(#gradient-liabilities)'
                  fillOpacity= { 0.2 }
                  stroke= '#ef4444'
                  strokeOpacity= { 0.5 }
                  strokeWidth= { 1 }
                  dot= { false }
                  activeDot= { false }
                />
              ) }

              { visibleSeries.real && (
                <Area
                  type= 'monotone'
                  dataKey= 'real'
                  fill= 'url(#pattern-real)'
                  fillOpacity= { 0.25 }
                  stroke= '#8884d8'
                  strokeOpacity= { 0.5 }
                  strokeWidth= { 1.5 }
                  dot= { false }
                  activeDot= { false }
                />
              ) }

              { visibleSeries.netWorth && (
                <Line
                  type= 'monotone'
                  dataKey= 'netWorth'
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
              ) }
            </ComposedChart>
        </ResponsiveContainer>

        { /** Legend */ }
        <div className= 'flex flex-wrap justify-center items-center gap-4 mt-4 pt-6 border-t border-slate-200'>
          { legendItems.map( item => {
            const isVisible = visibleSeries[ item.key ];

            return (
              <button
                key= { item.key }
                onClick= { () => toggleSeries( item.key ) }
                className= { cn(
                  'flex items-center gap-2.5 px-2 py-1 text-sm font-medium',
                  isVisible ? 'text-slate-700' : 'text-slate-400 opacity-60'
                ) }
              >
                <div className= 'w-3 h-3 rounded-full' style= { { backgroundColor: item.color } } />
                <span>{ item.label }</span>
              </button>
            );
          } ) }
        </div>
      </Card>

      { /** Further Metrics */ }
      { portfolioStats && (
        <div className= 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full'>
          <InfoCard
            label= { i18n.t( $ => $.dashboard.percentile ) }
            value= { formatPercent( portfolioStats.globalPercentile, display ) }
          />
          <InfoCard
            label= { i18n.t( $ => $.equivalent.gold ) }
            value= { formatUnit( 'gram', portfolioStats.equivalents?.gold, display ) }
          />
          <InfoCard
            label= { i18n.t( $ => $.equivalent.workingHrs ) }
            value= { formatUnit( 'hour', portfolioStats.equivalents?.workingHrs, { ...display, decimals: 0 } ) }
          />
          <InfoCard
            label= { i18n.t( $ => $.equivalent.coinStack ) }
            value= { formatUnit( 'meter', portfolioStats.equivalents?.coinStack, { ...display, decimals: 1 } ) }
          />
        </div>
      ) }
    </div>
  );
};
