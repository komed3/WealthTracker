import { Intro } from '@/src/components/ui/Intro';
import { NoData } from '@/src/components/ui/NoData';
import { Select } from '@/src/components/ui/Select';
import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import i18n from '@/src/lib/i18n';
import { useEffect, useMemo, useState } from 'react';

export const Report = () => {
  const { data, settings } = useData();
  const { setTitle } = useLayout();
  const display = settings!.display;

  useEffect( () => { setTitle( i18n.t( $ => $.report.title ) ) }, [ setTitle, display.language ] );

  const sortedYears = useMemo(
    () => Object.values( data?.computed.years ?? {} ).map( s => s.year ).sort( ( a, b ) => a - b ),
    [ data ]
  );

  if ( ! data || sortedYears.length === 0 ) return <NoData />;

  const [ selectedYear, setSelectedYear ] = useState < number > ( 0 );

  useEffect( () => {
    if ( sortedYears.length > 0 && selectedYear === 0 ) setSelectedYear( sortedYears[ sortedYears.length - 1 ] );
  }, [ sortedYears, selectedYear ] );

  const snapshot = useMemo(
    () => data.computed.years[ String( selectedYear ) as `${number}` ] || null,
    [ data, selectedYear ]
  );

  const prevSnapshot = useMemo(
    () => data.computed.years[ String( selectedYear - 1 ) as `${number}` ] || null,
    [ data, selectedYear ]
  );

  const yearOptions = useMemo( () => (
    sortedYears.slice().reverse().map( y => ( {
      value: String( y ), label: String( y )
    } ) )
  ), [ sortedYears ] );

  return (
    <div className= 'space-y-8'>
      { /** Page Header */ }
      <Intro
        title= { i18n.t( $ => $.report.title ) }
        description= { i18n.t( $ => $.report.description, { year: selectedYear } ) }
      >
        <div className= 'shrink-0 min-w-36'>
          <Select
            value= { String( selectedYear ) }
            options= { yearOptions }
            onChange= { ( e ) => setSelectedYear( Number( e.target.value ) ) }
          />
        </div>
      </Intro>
    </div>
  );
};
