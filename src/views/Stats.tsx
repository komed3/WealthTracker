import { NoData } from '@/src/components/ui/NoData';
import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import i18n from '@/src/lib/i18n';
import { useEffect } from 'react';
import { Intro } from '@/src/components/ui/Intro';

export const Stats = () => {
  const { data, settings } = useData();
  const { setTitle } = useLayout();
  const display = settings!.display;

  useEffect( () => { setTitle( i18n.t( $ => $.stats.title ) ) }, [ setTitle, display.language ] );

  if ( data?.entries.length === 0 || ! data?.computed.portfolio ) return <NoData />;

  return (
    <div className= 'space-y-8'>
      { /** Page Header */ }
      <Intro
        title= { i18n.t( $ => $.stats.title ) }
        description= { i18n.t( $ => $.stats.description ) }
      />
    </div>
  );
};
