import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import i18n from '@/src/lib/i18n';
import { useEffect, useState } from 'react';
import { Intro } from '@/src/components/ui/Intro';
import { Tabs } from '@/src/components/ui/Tabs';
import { BookOpenText, Layers, LayoutDashboard, PiggyBank } from 'lucide-react';

export const Breakdown = () => {
  const { setTitle } = useLayout();
  const { settings } = useData();
  const display = settings!.display;

  useEffect( () => { setTitle( i18n.t( $ => $.breakdown.title ) ) }, [ setTitle, display.language ] );

  const [ viewMode, setViewMode ] = useState( 'asset' );

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
    </div>
  );
};
