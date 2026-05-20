import { Card, InfoCard } from '@/src/components/ui/Card';
import { Heading } from '@/src/components/ui/Heading';
import { NoData } from '@/src/components/ui/NoData';
import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import { formatCurrency, formatPercent } from '@/src/lib/formatter';
import i18n from '@/src/lib/i18n';
import { useEffect, useMemo } from 'react';

export const Dashboard = () => {
  const { settings, data } = useData();
  const { setTitle } = useLayout();
  const display = settings!.display;

  useEffect( () => { setTitle( i18n.t( $ => $.dashboard.title ) ) }, [ setTitle, display.language ] );

  const hasData = data && Object.keys( data.computed.years ).length;
  const portfolioStats = data?.computed?.portfolio;

  const snapshots = useMemo( () => (
    Object.values( data?.computed.years ?? {} ).sort( ( a, b ) => a.year - b.year )
  ), [ data ] );

  // Assemble details and derive boundaries for visualization
  const yearDetails = useMemo( () => snapshots.map( ( s ) => {
    const netWorth = s.netWorth;
    const minNetWorth = s.minNetWorth ?? s.netWorth;
    const maxNetWorth = s.maxNetWorth ?? s.netWorth;

    return {
      ...s, netWorth, minNetWorth, maxNetWorth,
      range: [ minNetWorth, maxNetWorth ]
    };
  } ), [ snapshots ] );

  const latest = useMemo( () => yearDetails.slice().reverse()[ 0 ], [ yearDetails ] );

  return ! hasData ? <NoData /> : (
    <div className= 'space-y-8'>
      { /** Key Metrics */ }
      { portfolioStats && latest && (
        <div className= 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full'>
          <InfoCard
            label= { i18n.t( $ => $.momentum.netWorth ) }
            value= { formatCurrency( portfolioStats.latestNetWorth, display ) }
          />
          <InfoCard
            label= { i18n.t( $ => $.momentum.assets ) }
            value= { formatCurrency( latest.assets, display ) }
          />
          <InfoCard
            label= { i18n.t( $ => $.momentum.liabilities ) }
            value= { formatCurrency( latest.liabilities, display ) }
          />
          <InfoCard
            label= { i18n.t( $ => $.momentum.avgGrowth ) }
            value= {
              portfolioStats.averageAnnualGrowth !== undefined
                ? formatPercent( portfolioStats.averageAnnualGrowth, display )
                : '—'
            }
          />
        </div>
      ) }

      { /** Wealth Timeline */ }
      <Card className= 'flex flex-col gap-6 p-6'>
        <div className= 'flex flex-col gap-1.5'>
          <Heading level= { 3 }>
            { i18n.t( $ => $.dashboard.chartTitle ) }
          </Heading>
          <p className= 'text-sm text-slate-500'>
            { i18n.t( $ => $.dashboard.chartSubtitle ) }
          </p>
        </div>
      </Card>
    </div>
  );
};
