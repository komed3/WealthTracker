import { Card } from '@/src/components/ui/Card';
import { CustomTooltip, xAxisInterval, yAxisFormatter } from '@/src/components/ui/Chart';
import { Heading } from '@/src/components/ui/Heading';
import { Intro } from '@/src/components/ui/Intro';
import { NoData } from '@/src/components/ui/NoData';
import { Select } from '@/src/components/ui/Select';
import { Tabs } from '@/src/components/ui/Tabs';
import {
  ASSET_CLASS, CLASS, CLASS_COLORS, LIABILITY_CLASS, LIQUIDITY,
  LIQUIDITY_COLORS, REALIZATION_COLORS
} from '@/src/config/constants';
import { useData } from '@/src/context/DataCtx';
import { useIsMobile, useLayout } from '@/src/context/LayoutCtx';
import { formatCurrency, formatPercent } from '@/src/lib/formatter';
import i18n from '@/src/lib/i18n';
import type { YearSnapshot } from '@/src/types/data';
import { BookOpenText, Layers, LayoutDashboard, PiggyBank } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Bar, BarChart, CartesianGrid, Pie, PieChart, ReferenceLine,
  ResponsiveContainer, Sector, Tooltip, XAxis, YAxis
} from 'recharts';

export const Breakdown = () => {
  const { setTitle } = useLayout();
  const isMobile = useIsMobile();
  const { data, settings } = useData();
  const display = settings!.display;

  useEffect( () => { setTitle( i18n.t( $ => $.breakdown.title ) ) }, [ setTitle, display.language ] );

  if ( ! data || Object.keys( data.computed.years ).length === 0 ) return <NoData />;

  const [ viewMode, setViewMode ] = useState( 'asset' );
  const [ selectedYear, setSelectedYear ] = useState < number > ( 0 );

  const sortedYears = useMemo(
    () => Object.values( data.computed.years ).map( s => s.year ).sort( ( a, b ) => a - b ),
    [ data ]
  );

  useEffect( () => {
    if ( sortedYears.length > 0 && selectedYear === 0 ) {
      setSelectedYear( sortedYears[ sortedYears.length - 1 ] );
    }
  }, [ sortedYears, selectedYear ] );

  const yearOptions = useMemo( () => sortedYears.slice().reverse().map( y => ( {
    value: String( y ), label: String( y )
  } ) ), [ sortedYears ] );

  const getBreakdown = ( snapshot: YearSnapshot | undefined, yearKey: number ): Array< {
    id: string, title: string, value: number, share: number, color: string;
  } > => {
    if ( ! snapshot ) return [];

    switch ( viewMode ) {
      case 'asset':
        const assetsSum = snapshot.assets || 0;
        const liabilitiesSum = snapshot.liabilities || 0;

        return data.entries.map( r => {
          const value = r.history[ String( yearKey ) as `${number}` ]?.value ?? 0;
          const total = r.entry.category === 'asset' ? assetsSum : liabilitiesSum;

          return {
            id: r.entry.id, title: r.entry.title,
            share: total > 0 ? value / total : 0,
            color: r.entry.color, value
          };
        } );

      case 'class':
        return Object.entries( snapshot.byClass ).map( ( [ cls, b ] ) => ( {
          id: cls,
          title: ASSET_CLASS.includes( cls as any )
            ? i18n.t( $ => $.assetClass[ cls as ASSET_CLASS ] )
            : i18n.t( $ => $.liabilityClass[ cls as LIABILITY_CLASS ] ),
          value: b?.value ?? 0, share: b?.percentage ?? 0,
          color: CLASS_COLORS[ cls as CLASS ] || '#64748b'
        } ) );

      case 'liquidity':
        return Object.entries( snapshot.byLiquidity ).map( ( [ liq, b ] ) => ( {
          id: liq,
          title: i18n.t( $ => $.liquidity[ Number( liq ) as LIQUIDITY ] ),
          value: b?.value ?? 0, share: b?.percentage ?? 0,
          color: LIQUIDITY_COLORS[ Number( liq ) as LIQUIDITY ] || '#64748b'
        } ) );

      case 'realization':
        return [ {
          id: 'real', title: i18n.t( $ => $.breakdown.real ),
          value: snapshot.realization.real.value,
          share: snapshot.realization.real.percentage,
          color: REALIZATION_COLORS.real
        }, {
          id: 'nonReal', title: i18n.t( $ => $.breakdown.notional ),
          value: snapshot.realization.nonReal.value,
          share: snapshot.realization.nonReal.percentage,
          color: REALIZATION_COLORS.nonReal
        } ];
    }

    return [];
  };

  const currentListData = useMemo( () => {
    const snapshot = data.computed.years[ String( selectedYear ) as `${number}` ];
    return getBreakdown( snapshot, selectedYear )
      .filter( item => item.value !== 0 )
      .sort( ( a, b ) => b.value - a.value );
  }, [ selectedYear, viewMode, data ] );

  const stackedChartData = useMemo( () => {
    return sortedYears.map( yearKey => {
      const snapshot = data.computed.years[ String( yearKey ) as `${number}` ];
      const row: any = { year: yearKey };

      getBreakdown( snapshot, yearKey ).forEach( item => {
        row[ item.id ] = item.value;
      } );

      return row;
    } );
  }, [ sortedYears, viewMode, data ] );

  const stackedItems = useMemo( () => {
    const activeIds = new Set< string >();
    stackedChartData.forEach( row => {
      Object.entries( row ).forEach( ( [ key, val ] ) => {
        if ( key !== 'year' && Number( val ) > 0 ) activeIds.add( key );
      } );
    } );

    const idToMeta = new Map< string, { title: string; color: string } >();
    sortedYears.forEach( y => {
      const snapshot = data.computed.years[ String( y ) as `${number}` ];
      getBreakdown( snapshot, y ).forEach( item => {
        idToMeta.set( item.id, { title: item.title, color: item.color } );
      } );
    } );

    return Array.from( activeIds ).map( id => ( {
      id, title: idToMeta.get( id )?.title, color: idToMeta.get( id )?.color
    } ) );
  }, [ stackedChartData, sortedYears, viewMode, data ] );

  return (
    <div className= 'space-y-8'>
      { /** Page Header */ }
      <Intro
        title= { i18n.t( $ => $.breakdown.title ) }
        description= { i18n.t( $ => $.breakdown.description ) }
      >
        <Tabs
          options= { [
            { id: 'asset', label: i18n.t( $ => $.breakdown.asset ), icon: Layers },
            { id: 'class', label: i18n.t( $ => $.breakdown.class ), icon: LayoutDashboard },
            { id: 'liquidity', label: i18n.t( $ => $.breakdown.liquidity ), icon: PiggyBank },
            { id: 'realization', label: i18n.t( $ => $.breakdown.realization ), icon: BookOpenText }
          ] }
          activeId= { viewMode }
          onChange= { setViewMode }
        />
      </Intro>

      { /** Annual Breakdown */ }
      <Card className= 'flex flex-col gap-6'>
        <div className= 'flex flex-col sm:flex-row justify-between sm:items-center gap-4'>
          <div>
            <Heading level= { 3 }>
              { i18n.t( $ => $.breakdown.breakdown ) }
            </Heading>
            <p className= 'text-sm text-slate-500'>
              { i18n.t( $ => $.breakdown.breakdownInfo, { year: selectedYear } ) }
            </p>
          </div>
          <div className= 'shrink-0 min-w-36'>
            <Select
              value= { String( selectedYear ) }
              options= { yearOptions }
              onChange= { ( e ) => setSelectedYear( Number( e.target.value ) ) }
            />
          </div>
        </div>

        <div className= 'flex flex-col 2xl:flex-row gap-10'>
          <div className= 'flex-2'>
            <ResponsiveContainer width= '100%' height= { 360 }>
              <PieChart>
                <Pie
                  data= { currentListData }
                  dataKey= 'value'
                  cx= '50%'
                  cy= '50%'
                  innerRadius= '65%'
                  outerRadius= '90%'
                  paddingAngle= { 2 }
                  shape= { ( props ) => {
                    return (
                      <Sector
                        { ...props }
                        fill= { props.payload.color }
                      />
                    );
                  } }
                />
                <Tooltip
                  content= { ( { active, payload } ) => {
                    if ( active && payload && payload.length ) {
                      const item = payload[ 0 ].payload;

                      return (
                        <CustomTooltip
                          label= { item.title }
                          value= { formatPercent( item.share, display ) }
                          color= { item.color }
                        >
                          <div className= 'flex justify-between gap-4'>
                            <span>{ i18n.t( $ => $.breakdown.value ) }</span>
                            <span className= 'font-mono font-semibold text-slate-800'>
                              { formatCurrency( item.value, display ) }
                            </span>
                          </div>
                        </CustomTooltip>
                      );
                    }
                    return null;
                  } }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className= 'hidden 2xl:block self-stretch shrink-0 w-0 border-l-2 border-dashed border-slate-200' />

          <div className= 'flex-3 w-full max-h-90 space-y-3 overflow-y-auto'>
            { currentListData.length === 0 ? (
              <div className= 'py-16 text-center text-lg font-light tracking-wider text-slate-400'>
                { i18n.t( $ => $.breakdown.noData ) }
              </div>
            ) : (
              <div className= 'divide-y divide-dashed divide-slate-200'>
                { currentListData.map( ( item ) => {
                  if ( ! item ) return null;

                  return (
                    <div
                      key= { item.id }
                      className= 'flex justify-between items-center gap-4 py-4'
                    >
                      <div className= 'flex items-center gap-3 min-w-0'>
                        <div
                          className= 'shrink-0 w-3 h-3 rounded-full'
                          style= { { backgroundColor: item.color } }
                        />
                        <p className= 'truncate leading-snug font-semibold text-slate-800'>
                          { item.title }
                        </p>
                      </div>
                      <div className= 'shrink-0 flex items-baseline gap-4 text-right text-slate-800'>
                        <p className= 'font-mono font-bold text-lg leading-none'>
                          { formatCurrency( item.value, display ) }
                        </p>
                        <p className= 'font-mono font-semibold text-xs leading-none'>
                          ({ formatPercent( item.share, display ) })
                        </p>
                      </div>
                    </div>
                  );
                } ) }
              </div>
            ) }
          </div>
        </div>
      </Card>

      { /** Historical Development */ }
      <Card className= 'flex flex-col gap-6'>
        <div>
          <Heading level= { 3 }>
            { i18n.t( $ => $.breakdown.history ) }
          </Heading>
          <p className= 'text-sm text-slate-500'>
            { i18n.t( $ => $.breakdown.historyInfo ) }
          </p>
        </div>

        <ResponsiveContainer width= '100%' aspect= { 1.8 } maxHeight= { 420 }>
          <BarChart
            data= { stackedChartData }
            margin= { { top: 10, right: 20, left: 20, bottom: 10 } }
          >
            <CartesianGrid
              strokeDasharray= '3 3'
              stroke= '#f1f5f9'
              vertical= { false }
            />
            <XAxis
              dataKey= 'year'
              interval= { xAxisInterval( { value: stackedChartData.length, isMobile } ) }
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
                  const sortedPayload = payload.slice()
                    .filter( r => r.value ?? 0 > 0 )
                    .sort( ( a, b ) => Number( b.value ) - Number( a.value ) );
                  const total = sortedPayload
                    .reduce( ( sum, p ) => sum + Number( p.value ), 0 );

                  return (
                    <CustomTooltip
                      label= { String( sortedPayload[ 0 ].payload.year ) }
                      value= { formatCurrency( total, display ) }
                    >
                      { sortedPayload.map( ( { dataKey, name, value } ) => (
                        <div key= { String( dataKey ) } className= 'flex justify-between gap-6'>
                          <span>{ name }</span>
                          <span className= 'flex gap-2 font-mono'>
                            <span className= 'font-semibold text-slate-800'>
                              { formatCurrency( value, display ) }
                            </span>
                            <span className= 'text-slate-600'>
                              ({ formatPercent( total ? ( value as number ) / total : 0, display ) })
                            </span>
                          </span>
                        </div>
                      ) ) }
                    </CustomTooltip>
                  );
                }
              } }
              cursor= { { fill: '#f1f5f9', opacity: 0.4 } }
            />
            <ReferenceLine
              y= { 0 }
              stroke= '#cbd5e1'
              strokeWidth= { 2 }
              style= { { opacity: 0.6 } }
            />

            { stackedItems.map( ( item ) => (
              <Bar
                key= { item.id }
                dataKey= { item.id }
                name= { item.title }
                stackId= 'a'
                fill= { item.color }
                stroke= '#ffffff'
                strokeWidth= { 2 }
              />
            ) ) }
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
