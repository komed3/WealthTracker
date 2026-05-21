import { Intro } from '@/src/components/ui/Intro';
import { NoData } from '@/src/components/ui/NoData';
import { Select } from '@/src/components/ui/Select';
import { Tabs } from '@/src/components/ui/Tabs';
import { ASSET_CLASS, CATEGORY, LIABILITY_CLASS, LIQUIDITY } from '@/src/config/constants';
import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import i18n from '@/src/lib/i18n';
import { Percent, Sigma } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export const Assets = () => {
  const { data, settings } = useData();
  const { setTitle } = useLayout();
  const all = { value: 'all', label: i18n.t( $ => $.assets.all ) };
  const display = settings!.display;
  const entries = data?.entries ?? [];
  const computed = data?.computed;

  useEffect( () => { setTitle( i18n.t( $ => $.assets.title ) ) }, [ setTitle, display.language ] );

  const [ viewMode, setViewMode ] = useState( 'absolute' );
  const [ category, setCategory ] = useState( 'all' );
  const [ classVal, setClassVal ] = useState( 'all' );
  const [ liquidity, setLiquidity ] = useState( 'all' );
  const [ archived, setArchived ] = useState( 'all' );
  const [ notional, setNotional ] = useState( 'all' );

  const sortedYears = useMemo( () => {
    if ( ! computed?.years ) return [];
    return Object.values( computed.years ).map( s => s.year ).sort( ( a, b ) => a - b );
  }, [ computed ] );

  const lastYear = sortedYears[ sortedYears.length - 1 ];

  const categoryOptions = [ all, ...CATEGORY.map( cat => ( {
    value: cat, label: i18n.t( $ => $.category[ cat ] )
  } ) ) ];

  const handleCategoryChange = ( value: string ) => {
    setCategory( value );
    setClassVal( 'all' );
  };

  const classOptions = [ all, ...ASSET_CLASS.map( cls => ( {
    value: cls, label: i18n.t( $ => $.assetClass[ cls ] )
  } ) ), ...LIABILITY_CLASS.map( cls => ( {
    value: cls, label: i18n.t( $ => $.liabilityClass[ cls ] )
  } ) ) ];

  const liquidityOptions = [ all, ...LIQUIDITY.map( liq => ( {
    value: liq, label: `${ i18n.t( $ => $.liquidity[ liq as 1 | 2 | 3 | 4 | 5 ] ) }`
  } ) ) ];

  const archivedOptions = useMemo( () => [
    { value: 'all', label: i18n.t( $ => $.assets.all ) },
    { value: 'active', label: i18n.t( $ => $.assets.active ) },
    { value: 'archived', label: i18n.t( $ => $.assets.archived ) }
  ], [ display.language ] );

  const notionalOptions = useMemo( () => [
    { value: 'all', label: i18n.t( $ => $.assets.all ) },
    { value: 'real', label: i18n.t( $ => $.assets.real ) },
    { value: 'notional', label: i18n.t( $ => $.assets.notional ) }
  ], [ display.language ] );

  const filteredRecords = useMemo( () => {
    return entries.filter( record => {
      const { entry } = record;

      if ( category !== 'all' && entry.category !== category ) return false;
      if ( classVal !== 'all' && entry.class !== classVal ) return false;
      if ( liquidity !== 'all' && String( entry.liquidity ) !== liquidity ) return false;

      if ( archived !== 'all' ) {
        if ( archived === 'archived' && ! entry.archived ) return false;
        if ( archived === 'active' && entry.archived ) return false;
      }

      if ( notional !== 'all' ) {
        const isEntryNotional = entry.notional ?? false;
        if ( notional === 'notional' && ! isEntryNotional ) return false;
        if ( notional === 'real' && isEntryNotional ) return false;
      }

      return true;
    } );
  }, [ entries, category, classVal, liquidity, archived, notional ] );

  return entries.length === 0 ? <NoData /> : (
    <div className= 'space-y-8'>
      { /** Page Header */ }
      <Intro
        title= { i18n.t( $ => $.assets.title ) }
        description= { i18n.t( $ => $.assets.description ) }
      >
        <Tabs
          options= { [
            { id: 'absolute', label: i18n.t( $ => $.assets.absolute ), icon: Sigma },
            { id: 'relative', label: i18n.t( $ => $.assets.relative ), icon: Percent }
          ] }
          activeId= { viewMode }
          onChange= { setViewMode }
        />
      </Intro>

      { /** Filters */ }
      <div className= 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
        <Select
          label= { i18n.t( $ => $.assets.category ) }
          value= { category }
          options= { categoryOptions }
          onChange= { e => handleCategoryChange( e.target.value ) }
        />
        <Select
          label= { i18n.t( $ => $.assets.class ) }
          value= { classVal }
          options= { classOptions }
          onChange= { ( e ) => setClassVal( e.target.value ) }
        />
        <Select
          label= { i18n.t( $ => $.assets.liquidity ) }
          value= { liquidity }
          options= { liquidityOptions }
          onChange= { ( e ) => setLiquidity( e.target.value ) }
        />
        <Select
          label= { i18n.t( $ => $.assets.archived ) }
          value= { archived }
          options= { archivedOptions }
          onChange= { ( e ) => setArchived( e.target.value ) }
        />
        <Select
          label= { i18n.t( $ => $.assets.notional ) }
          value= { notional }
          options= { notionalOptions }
          onChange= { ( e ) => setNotional( e.target.value ) }
        />
      </div>

      { /** Assets Grid */ }
      { filteredRecords.length === 0 ? (
        <div className= 'flex flex-col justify-center items-center gap-2 py-20 text-center'>
          <p className= 'text-xl font-semibold text-slate-600'>
            { i18n.t( $ => $.assets.emptyTitle ) }
          </p>
          <p className= 'text-slate-400'>
            { i18n.t( $ => $.assets.emptyInfo ) }
          </p>
        </div>
      ) : ( <></> ) }
    </div>
  );
};
