import { Card } from '@/src/components/ui/Card';
import { Heading } from '@/src/components/ui/Heading';
import { Intro } from '@/src/components/ui/Intro';
import { NoData } from '@/src/components/ui/NoData';
import { Select } from '@/src/components/ui/Select';
import { Tabs } from '@/src/components/ui/Tabs';
import { ASSET_CLASS, CLASS, CLASS_COLORS, LIABILITY_CLASS, LIQUIDITY, LIQUIDITY_COLORS } from '@/src/config/constants';
import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import i18n from '@/src/lib/i18n';
import type { YearSnapshot } from '@/src/types/data';
import { BookOpenText, Layers, LayoutDashboard, PiggyBank } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Pie, PieChart, ResponsiveContainer, Sector } from 'recharts';

export const Breakdown = () => {
  const { setTitle } = useLayout();
  const { data, settings } = useData();
  const display = settings!.display;

  useEffect( () => { setTitle( i18n.t( $ => $.breakdown.title ) ) }, [ setTitle, display.language ] );

  if ( ! data?.computed.years ) return <NoData />;

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
    }

    return [];
  };

  const currentListData = useMemo( () => {
    const snapshot = data.computed.years[ String( selectedYear ) as `${number}` ];
    return getBreakdown( snapshot, selectedYear )
      .filter( item => item.value !== 0 )
      .sort( ( a, b ) => b.value - a.value );
  }, [ selectedYear, viewMode, data ] );

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
            <ResponsiveContainer width= '100%' height= { 320 }>
              <PieChart>
                <Pie
                  data= { currentListData }
                  dataKey= 'value'
                  cx= '50%'
                  cy= '50%'
                  innerRadius= { 80 }
                  outerRadius= { 120 }
                  paddingAngle= { 2 }
                  shape={ ( props ) => {
                    return (
                      <Sector
                        { ...props }
                        fill= { props.payload.color }
                      />
                    );
                  } }
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className= 'self-stretch shrink-0 w-0 border-l border-dashed border-slate-200' />
          <div className= 'flex-3 w-md'></div>
        </div>
      </Card>
    </div>
  );
};
