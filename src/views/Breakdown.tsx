import { Card } from '@/src/components/ui/Card';
import { Heading } from '@/src/components/ui/Heading';
import { Intro } from '@/src/components/ui/Intro';
import { NoData } from '@/src/components/ui/NoData';
import { Select } from '@/src/components/ui/Select';
import { Tabs } from '@/src/components/ui/Tabs';
import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import i18n from '@/src/lib/i18n';
import { BookOpenText, Layers, LayoutDashboard, PiggyBank } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer } from 'recharts';

export const Breakdown = () => {
  const { setTitle } = useLayout();
  const { data, settings } = useData();
  const display = settings!.display;

  useEffect( () => { setTitle( i18n.t( $ => $.breakdown.title ) ) }, [ setTitle, display.language ] );

  if ( ! data?.computed.years ) return <NoData />;

  const [ viewMode, setViewMode ] = useState( 'asset' );
  const [ selectedYear, setSelectedYear ] = useState < number > ( 0 );

  const sortedYears = useMemo( () => Object.values( data.computed.years ).map( s => s.year ).sort( ( a, b ) => a - b ), [ data ] );
  useEffect( () => { setSelectedYear( sortedYears[ sortedYears.length - 1 ] ) }, [ sortedYears, selectedYear ] );

  const yearOptions = useMemo( () => sortedYears.slice().reverse().map( y => ( {
    value: String( y ), label: String( y )
  } ) ), [ sortedYears ] );

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
              //
            </ResponsiveContainer>
          </div>
          <div className= 'self-stretch shrink-0 w-0 border-l border-dashed border-slate-200' />
          <div className= 'flex-3 w-md'></div>
        </div>
      </Card>
    </div>
  );
};
