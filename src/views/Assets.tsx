import { Card } from '@/src/components/ui/Card';
import { Heading } from '@/src/components/ui/Heading';
import { Icon } from '@/src/components/ui/Icon';
import { Intro } from '@/src/components/ui/Intro';
import { NoData } from '@/src/components/ui/NoData';
import { Select } from '@/src/components/ui/Select';
import { Tabs } from '@/src/components/ui/Tabs';
import { ASSET_CLASS, CATEGORY, LIABILITY_CLASS, LIQUIDITY } from '@/src/config/constants';
import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import { formatCurrency, formatPercent } from '@/src/lib/formatter';
import i18n from '@/src/lib/i18n';
import { Percent, Sigma } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';

export const Assets = () => {
  const { data, settings } = useData();
  const { setTitle } = useLayout();
  const all = { value: 'all', label: i18n.t( $ => $.assets.all ) };
  const display = settings!.display;
  const entries = data?.entries ?? [];
  const computed = data?.computed;

  useEffect( () => { setTitle( i18n.t( $ => $.assets.title ) ) }, [ setTitle, display.language ] );

  if ( entries.length === 0 ) return <NoData />;

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

  const categoryOptions = useMemo( () => [ all, ...CATEGORY.map( cat => ( {
    value: cat, label: i18n.t( $ => $.category[ cat ] )
  } ) ) ], [ display.language ] );

  const handleCategoryChange = ( value: string ) => {
    setCategory( value );
    setClassVal( 'all' );
  };

  const classOptions = useMemo( () => {
    const list: { value: string, label: string }[] = [ all ];
    const seen = new Set< string >();
    seen.add( 'all' );

    if ( category === 'all' || category === 'asset' ) ASSET_CLASS.forEach( c => {
      if ( ! seen.has( c ) ) {
        list.push( { value: c, label: i18n.t( $ => $.assetClass[ c ] ) } );
        seen.add( c );
      }
    } );

    if ( category === 'all' || category === 'liability' ) LIABILITY_CLASS.forEach( c => {
      if ( ! seen.has( c ) ) {
        list.push( { value: c, label: i18n.t( $ => $.liabilityClass[ c ] ) } );
        seen.add( c );
      }
    } );

    return list;
  }, [ category, display.language ] );

  const liquidityOptions = useMemo( () => [ all, ...LIQUIDITY.map( liq => ( {
    value: String( liq ), label: `${ i18n.t( $ => $.liquidity[ liq ] ) }`
  } ) ) ], [ display.language ] );

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

  return (
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

      <div className= 'my-10 border-t-2 border-dashed border-slate-200' />

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
      ) : (
        <div className= 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
          <AnimatePresence mode= 'sync'>
            { filteredRecords.map( ( { entry, history } ) => {
              const entryStats = computed?.entries?.[ entry.id ];
              const currentAbs = entryStats?.latestValue ?? 0;
              const currentRel = entryStats?.relativeHistory?.[ String( lastYear ) as `${number}` ] ?? 0;

              const sparklineData = sortedYears.map( yearKey => {
                const yearStr = String( yearKey ) as `${number}`;
                const val = history[ yearStr ]?.value ?? 0;
                const relVal = entryStats?.relativeHistory?.[ yearStr ] ?? 0;

                return { year: yearKey, absolute: val, relative: relVal };
              } );

              const classLabel = entry.category === 'asset'
                ? i18n.t( $ => $.assetClass[ entry.class ] )
                : i18n.t( $ => $.liabilityClass[ entry.class ] );

              return (
                <motion.div
                  layout
                  key= { entry.id }
                  initial= { { opacity: 0, scale: 0.9 } }
                  animate= { { opacity: 1, scale: 1 } }
                  exit= { { opacity: 0, scale: 0.9 } }
                  transition= { { duration: 0.3 } }
                >
                  <Card className= 'flex flex-col p-0 md:p-0'>
                    <div className= 'flex justify-between items-start gap-4 mb-2 p-3 space-y-4'>
                      { /** Header Link */ }
                      <Link
                        to= { `/asset/${ entry.id }` }
                        className= 'flex items-center gap-3 m-0 w-full min-w-0'
                      >
                        <div
                          className= 'flex justify-center items-center shrink-0 w-10 h-10 text-white rounded-xl'
                          style= { { backgroundColor: entry.color } }
                        >
                          <Icon name= { entry.icon } size= { 20 } />
                        </div>
                        <div className= 'min-w-0'>
                          <Heading level= { 4 } className= 'truncate text-lg font-semibold text-slate-800'>
                            { entry.title }
                          </Heading>
                          <div className= 'flex items-center gap-2 truncate uppercase text-[9.5px] font-semibold tracking-wide text-slate-400'>
                            <span>{ classLabel }</span>
                            <span className= 'text-slate-300'>—</span>
                            <span>L{ entry.liquidity }</span>
                          </div>
                        </div>
                      </Link>

                      { /** Value / Fraction Indicator */ }
                      <div className= 'shrink-0 text-right font-mono text-lg font-bold text-slate-950'>
                        { viewMode === 'absolute'
                          ? formatCurrency( currentAbs, display )
                          : formatPercent( currentRel, display )
                        }
                      </div>
                    </div>

                    { /** Sparkline */ }
                    <ResponsiveContainer width= '100%' height= { 132 }>
                      <AreaChart
                        data= { sparklineData }
                        margin= { { top: 10, right: 10, left: 10, bottom: 10 } }
                      >
                        <Tooltip
                          content= { ( { active, payload } ) => {
                            if ( active && payload && payload.length ) {
                              const dataPoint = payload[ 0 ].payload;
                              const formattedValue = viewMode === 'absolute'
                                ? formatCurrency( dataPoint.absolute, display )
                                : formatPercent( dataPoint.relative, display );

                              return (
                                <div className= {
                                  'flex items-center gap-1 px-2 py-1 font-mono font-bold text-[10px] ' +
                                  'bg-white border border-slate-200/80 rounded-lg shadow-sm'
                                }>
                                  <span className= 'text-slate-400'>{ dataPoint.year }:</span>
                                  <span style= { { color: entry.color } }>{ formattedValue }</span>
                                </div>
                              );
                            }
                          } }
                          cursor= { { stroke: '#cbd5e1', strokeWidth: 0.25 } }
                        />

                        <defs>
                          <linearGradient id= { `gradient-${entry.id}` } x1= '0' y1= '0' x2= '0' y2= '1'>
                            <stop offset= '0%' stopColor= { entry.color } stopOpacity= { 0.15 } />
                            <stop offset= '100%' stopColor= { entry.color } stopOpacity= { 0.0 } />
                          </linearGradient>
                        </defs>

                        <Area
                          type= 'monotone'
                          dataKey= { viewMode === 'absolute' ? 'absolute' : 'relative' }
                          stroke= { entry.color }
                          strokeWidth= { 2 }
                          fill= { `url(#gradient-${entry.id})` }
                          dot= { false }
                          activeDot= { { stroke: entry.color, strokeWidth: 2, fill: '#fff', r: 3.5 } }
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>
                </motion.div>
              );
            } ) }
          </AnimatePresence>
        </div>
      ) }
    </div>
  );
};
