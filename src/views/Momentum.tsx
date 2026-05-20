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

      { /** History Table */ }
      <div className= 'flex flex-col w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden'>
        <div className= 'whitespace-nowrap overflow-x-auto'>
          <table className= 'w-full text-left text-sm text-slate-800 border-collapse'>
            <thead>
              <tr className= 'uppercase font-semibold text-xs text-slate-500 tracking-wider bg-slate-50 border-b border-slate-200'>
                <th className= 'px-6 py-4'>{ i18n.t( $ => $.momentum.year ) }</th>
                <th className= 'px-6 py-4 text-right'>{ i18n.t( $ => $.momentum.netWorth ) }</th>
                <th className= 'px-6 py-4 text-right'>{ i18n.t( $ => $.momentum.absolute ) }</th>
                <th className= 'px-6 py-4 text-right'>{ i18n.t( $ => $.momentum.relative ) }</th>
                <th className= 'px-6 py-4 text-right'>{ i18n.t( $ => $.momentum.assets ) }</th>
                <th className= 'px-6 py-4 text-right'>{ i18n.t( $ => $.momentum.liabilities ) }</th>
              </tr>
            </thead>
            <tbody className= 'divide-y divide-slate-200'>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
