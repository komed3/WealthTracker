import { Card, InfoCard } from '@/src/components/ui/Card';
import { CustomTooltip, TooltipRow, xAxisInterval, yAxisFormatter } from '@/src/components/ui/Chart';
import { Heading } from '@/src/components/ui/Heading';
import { NoData } from '@/src/components/ui/NoData';
import { useData } from '@/src/context/DataCtx';
import { useIsMobile, useLayout } from '@/src/context/LayoutCtx';
import { formatCurrency, formatPercent, formatUnit } from '@/src/lib/formatter';
import i18n from '@/src/lib/i18n';
import { useEffect, useMemo } from 'react';
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

  // Assemble details and derive boundaries for visualization
  const yearDetails = useMemo( () => snapshots.map( ( s ) => {
    const netWorth = s.netWorth;
    const minNetWorth = s.minNetWorth ?? s.netWorth;
    const maxNetWorth = s.maxNetWorth ?? s.netWorth;

    return {
      ...s, netWorth, minNetWorth, maxNetWorth,
      range: [ minNetWorth, maxNetWorth ]
    };
  } ), [ snapshots ] );

  const latest = useMemo( () => yearDetails.slice().reverse()[ 0 ], [ yearDetails ] );

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
            value= { formatCurrency( latest.liabilities, display ) }
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
                        value= { formatCurrency( dataPoint.netWorth, display ) }
                        color= '#2563eb'
                      >
                        { dataPoint.maxNetWorth !== dataPoint.netWorth && (
                          <TooltipRow
                            label= { i18n.t( $ => $.dashboard.maximum ) }
                            value= { formatCurrency( dataPoint.maxNetWorth, display ) }
                          />
                        ) }
                        { dataPoint.minNetWorth !== dataPoint.netWorth && (
                          <TooltipRow
                            label= { i18n.t( $ => $.dashboard.minimum ) }
                            value= { formatCurrency( dataPoint.minNetWorth, display ) }
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

              { /** Semi-transparent range area band as backdrop */ }
              <Area
                type= 'monotone'
                dataKey= 'range'
                fill= '#2563eb'
                fillOpacity= { 0.08 }
                stroke= 'none'
                activeDot= { false }
              />

              { /** Subtle dashed upper boundary line */ }
              <Line
                type= 'monotone'
                dataKey= 'maxNetWorth'
                stroke= '#2563eb'
                strokeOpacity= { 0.25 }
                strokeWidth= { 1 }
                strokeDasharray= '4 4'
                dot= { false }
                activeDot= { false }
              />

              { /** Subtle dashed lower boundary line */ }
              <Line
                type= 'monotone'
                dataKey= 'minNetWorth'
                stroke= '#2563eb'
                strokeOpacity= { 0.25 }
                strokeWidth= { 1 }
                strokeDasharray= '4 4'
                dot= { false }
                activeDot= { false }
              />

              { /** Prominent styled primary actual timeline line with customized circular markers */ }
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
            </ComposedChart>
        </ResponsiveContainer>
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
