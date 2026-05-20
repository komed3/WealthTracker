import { Card, InfoCard } from '@/src/components/ui/Card';
import { CustomTooltip, yAxisFormatter } from '@/src/components/ui/Chart';
import { Intro } from '@/src/components/ui/Intro';
import { NoData } from '@/src/components/ui/NoData';
import { Tabs } from '@/src/components/ui/Tabs';
import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import { formatCurrency, formatPercent } from '@/src/lib/formatter';
import i18n from '@/src/lib/i18n';
import { cn } from '@/src/lib/utils';
import { Percent, Sigma } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, Rectangle, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const Momentum = () => {
  const { settings, data } = useData();
  const { setTitle } = useLayout();
  const display = settings!.display;

  const [ activeTab, setActiveTab ] = useState( 'relative' );
  const hasData = data && Object.keys( data.computed.years ).length;
  const portfolioStats = data?.computed?.portfolio;

  useEffect( () => {
    setTitle( i18n.t( $ => $.momentum.title ) );
  }, [ setTitle, display.language ] );

  const snapshots = useMemo( () => (
    Object.values( data?.computed.years ?? [] ).sort( ( a, b ) => a.year - b.year )
  ), [ data ] );

  const yearDetails = useMemo( () => snapshots.map( ( s ) => {
    const relativeGrowth = s.growth?.relative ?? 0;
    const absoluteGrowth = s.growth?.absolute ?? 0;

    return { ...s, relativeGrowth, absoluteGrowth };
  } ), [ snapshots ] );

  const chartData = useMemo( () => yearDetails.slice( 1 ).map( y => ( {
    year: y.year, raw: y,
    value: activeTab === 'relative' ? y.relativeGrowth : y.absoluteGrowth
  } ) ), [ yearDetails, activeTab ] );

  return (
    <div className= 'space-y-8'>
      { /** Page Header */ }
      <Intro
        title= { i18n.t( $ => $.momentum.title ) }
        description= { i18n.t( $ => $.momentum.description ) }
      >
        { hasData && <Tabs
          activeId= { activeTab }
          onChange= { id => setActiveTab( id ) }
          options={ [
            { id: 'relative', label: i18n.t( $ => $.momentum.relative ), icon: Percent },
            { id: 'absolute', label: i18n.t( $ => $.momentum.absolute ), icon: Sigma }
          ] }
        /> }
      </Intro>

      { /** No Data Available */ }
      { ! hasData && <NoData /> }

      { /** Key Metrics */ }
      { portfolioStats && (
        <div className= 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full'>
          <InfoCard
            label= { i18n.t( $ => $.momentum.avgGrowth ) }
            value= { formatPercent( portfolioStats.averageAnnualGrowth, display ) }
          />
          <InfoCard
            label= { i18n.t( $ => $.momentum.totalGrowth ) }
            value= { formatPercent( portfolioStats.totalGrowth?.relative, display ) }
          />
          <InfoCard
            label= { i18n.t( $ => $.momentum.bestYear ) }
            value= { portfolioStats.bestYear!.toString() }
          />
          <InfoCard
            label= { i18n.t( $ => $.momentum.worstYear ) }
            value= { portfolioStats.worstYear!.toString() }
          />
        </div>
      ) }

      { /** Momentum Chart */ }
      <Card>
        <ResponsiveContainer width= '100%' height= { 420 }>
          <BarChart
            data= { chartData }
            margin={ { top: 10, right: 10, left: 10, bottom: 5 } }
          >
            <XAxis
              dataKey= 'year'
              stroke= '#94a3b8'
              fontSize= { 12 }
              fontWeight= { 600 }
              tickLine= { false }
              axisLine= { false }
              dy= { 10 }
            />
            <YAxis
              tickFormatter= { ( value: number ) => yAxisFormatter( {
                type: activeTab === 'relative' ? 'percent' : 'currency',
                value
              } ) }
              stroke= '#94a3b8'
              fontSize= { 12 }
              fontWeight= { 600 }
              tickLine= { false }
              axisLine= { false }
            />
            <Tooltip
              content= { ( { active, payload } ) => {
                if ( active && payload && payload.length ) {
                  const dataPoint = payload[ 0 ].payload;
                  const formatter = activeTab === 'relative' ? formatPercent : formatCurrency;
                  const isPositive = dataPoint.value >= 0;

                  return (
                    <CustomTooltip
                      label= { dataPoint.year }
                      value= { formatter( Math.abs( dataPoint.value ), display ) }
                      color= { isPositive ? '#10b981' : '#ef4444' }
                    >
                      <div className= 'flex justify-between gap-4'>
                        <span>{ i18n.t( $ => $.momentum.netWorth ) }</span>
                        <span className= 'font-mono font-semibold text-slate-800'>
                          { formatCurrency( dataPoint.raw.netWorth, display ) }
                        </span>
                      </div>
                      <div className= 'flex justify-between gap-4'>
                        <span>{ i18n.t( $ => $.momentum.assets ) }</span>
                        <span className= 'font-mono font-semibold text-slate-800'>
                          { formatCurrency( dataPoint.raw.assets, display ) }
                        </span>
                      </div>
                      <div className= 'flex justify-between gap-4'>
                        <span>{ i18n.t( $ => $.momentum.liabilities ) }</span>
                        <span className= 'font-mono font-semibold text-slate-800'>
                          { formatCurrency( dataPoint.raw.liabilities, display ) }
                        </span>
                      </div>
                    </CustomTooltip>
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
              dataKey= 'value'
              shape={ ( props ) => {
                const { payload } = props;
                const isPositive = payload.value >= 0;

                return (
                  <Rectangle
                    { ...props }
                    className= 'transition-all duration-300'
                    fill= { isPositive ? '#10b981' : '#ef4444' }
                    radius= { [ 6, 6, 0, 0 ] }
                  />
                );
              } }
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      { /** History Table */ }
      <div className= 'flex flex-col w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden'>
        <div className= 'whitespace-nowrap overflow-x-auto'>
          <table className= 'w-full text-left text-sm text-slate-800 border-collapse'>
            <thead>
              <tr className= 'uppercase font-semibold text-xs text-slate-500 tracking-wider bg-slate-50 border-b border-slate-200'>
                <th className= 'px-6 py-4'>{ i18n.t( $ => $.momentum.year ) }</th>
                <th className= 'px-6 py-4 text-right'>{ i18n.t( $ => $.momentum.absolute ) }</th>
                <th className= 'px-6 py-4 text-right'>{ i18n.t( $ => $.momentum.relative ) }</th>
                <th className= 'px-6 py-4 text-right'>{ i18n.t( $ => $.momentum.netWorth ) }</th>
                <th className= 'px-6 py-4 text-right'>{ i18n.t( $ => $.momentum.assets ) }</th>
                <th className= 'px-6 py-4 text-right'>{ i18n.t( $ => $.momentum.liabilities ) }</th>
              </tr>
            </thead>
            <tbody className= 'divide-y divide-dashed divide-slate-200'>
              { yearDetails.slice().reverse().map( item => (
                <tr key= { item.year } className= 'h-16 align-middle'>
                  <td className= 'px-6 py-4 font-semibold text-sm text-slate-800'>{ item.year }</td>
                  { item.growth ? ( <>
                    <td className= { cn(
                      'px-6 py-4 text-right font-mono text-lg font-semibold text-slate-900',
                      item.growth.absolute < 0 ? 'text-neg' : 'text-pos'
                    ) }>
                      { formatCurrency( item.growth.absolute, display ) }
                    </td>
                    <td className= { cn(
                      'px-6 py-4 text-right font-mono text-lg font-semibold text-slate-900',
                      item.growth.relative < 0 ? 'text-neg' : 'text-pos'
                    ) }>
                      { formatPercent( item.growth.relative, display ) }
                    </td>
                  </> ) : ( <>
                    <td className= 'px-6 py-4 text-right font-bold text-slate-400'>—</td>
                    <td className= 'px-6 py-4 text-right font-bold text-slate-400'>—</td>
                  </> ) }
                  <td className= 'px-6 py-4 text-right font-mono text-sm font-semibold text-slate-900'>
                    { formatCurrency( item.netWorth, display ) }
                  </td>
                  <td className= 'px-6 py-4 text-right font-mono text-sm font-semibold text-slate-900'>
                    { formatCurrency( item.assets, display ) }
                  </td>
                  <td className= 'px-6 py-4 text-right font-mono text-sm font-semibold text-slate-900'>
                    { formatCurrency( item.liabilities, display ) }
                  </td>
                </tr>
              ) ) }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
