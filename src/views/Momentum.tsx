import { Intro } from '@/src/components/ui/Intro';
import { NoData } from '@/src/components/ui/NoData';
import { Tabs } from '@/src/components/ui/Tabs';
import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import i18n from '@/src/lib/i18n';
import { Percent, Sigma } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Momentum = () => {
  const { settings, data } = useData();
  const { setTitle } = useLayout();

  const [ activeTab, setActiveTab ] = useState( 'relative' );
  const hasData = data && Object.keys( data.computed.years ).length;

  useEffect( () => {
    setTitle( i18n.t( $ => $.momentum.title ) );
  }, [ setTitle, settings?.display.language ] );

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
    </div>
  );
};
