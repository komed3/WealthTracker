import { InfoCard } from '@/src/components/ui/Card';
import { Intro } from '@/src/components/ui/Intro';
import { NoData } from '@/src/components/ui/NoData';
import { Tabs } from '@/src/components/ui/Tabs';
import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import { formatPercent } from '@/src/lib/formatter';
import i18n from '@/src/lib/i18n';
import { Percent, Sigma } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Momentum = () => {
  const { settings, data } = useData();
  const { setTitle } = useLayout();

  const [ activeTab, setActiveTab ] = useState( 'relative' );
  const hasData = data && Object.keys( data.computed.years ).length;
  const portfolioStats = data?.computed?.portfolio;

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

      { /** Key Metrics */ }
      { portfolioStats && (
        <div className= 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full'>
          <InfoCard
            label= { i18n.t( $ => $.momentum.avgGrowth ) }
            value= { formatPercent( portfolioStats.averageAnnualGrowth ) }
          />
          <InfoCard
            label= { i18n.t( $ => $.momentum.totalGrowth ) }
            value= { formatPercent( portfolioStats.totalGrowth?.relative ) }
          />
          <InfoCard
            label= { i18n.t( $ => $.momentum.bestYear ) }
            value= { portfolioStats.bestYear!.toString() }
          />
          <InfoCard
            label= { i18n.t( $ => $.momentum.worstYear ) }
            value= { portfolioStats.worstYear!.toString() }
          />
        </div>
      ) }
    </div>
  );
};
