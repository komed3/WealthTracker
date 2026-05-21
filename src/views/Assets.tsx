import { Intro } from '@/src/components/ui/Intro';
import { Tabs } from '@/src/components/ui/Tabs';
import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import i18n from '@/src/lib/i18n';
import { Percent, Sigma } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ASSET_CLASS, CATEGORY, LIABILITY_CLASS, LIQUIDITY } from '@/src/config/constants';
import { Select } from '@/src/components/ui/Select';

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
      </div>
    </div>
  );
};
