import { Card, InfoCard } from '@/src/components/ui/Card';
import { Heading } from '@/src/components/ui/Heading';
import { Intro } from '@/src/components/ui/Intro';
import { NoData } from '@/src/components/ui/NoData';
import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import { formatCurrency, formatNumber, formatPercent } from '@/src/lib/formatter';
import i18n from '@/src/lib/i18n';
import { BriefcaseBusiness, PiggyBank, Scale } from 'lucide-react';
import { useEffect } from 'react';

export const Stats = () => {
  const { data, settings } = useData();
  const { setTitle } = useLayout();
  const display = settings!.display;

  useEffect( () => { setTitle( i18n.t( $ => $.stats.title ) ) }, [ setTitle, display.language ] );

  if ( data?.entries.length === 0 || ! data?.computed.portfolio ) return <NoData />;
  const stats = data.computed.portfolio;

  return (
    <div className= 'space-y-8'>
      { /** Page Header */ }
      <Intro
        title= { i18n.t( $ => $.stats.title ) }
        description= { i18n.t( $ => $.stats.description ) }
      />

      { /** Metrics */ }
      { stats && (
        <div className= 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full'>
          <InfoCard
            label= { i18n.t( $ => $.stats.netWorth ) }
            value= { formatCurrency( stats.latestNetWorth, display ) }
          />
          <InfoCard
            label= { i18n.t( $ => $.stats.growth ) }
            value= { formatPercent( stats.averageAnnualGrowth, display ) }
          />
          <InfoCard
            label= { i18n.t( $ => $.stats.percentile ) }
            value= { formatPercent( stats.globalPercentile, display ) }
          />
          <InfoCard
            label= { i18n.t( $ => $.stats.rank ) }
            value= { formatNumber( ( stats.globalPercentile ?? 0 ) * 8e9, display, { notation: 'compact' } ) }
          />
        </div>
      ) }

      { /** Milestones */ }
      { stats.milestones && (
        <div className= 'flex py-12'>
          { stats.milestones.slice( -6 ).map( ( m, i ) => (
            <div key= { i } className= 'flex-1 w-full space-y-6'>
              <div className= 'relative h-0 border-t-3 border-slate-800'>
                <div className= {
                  'absolute left-[50%] -translate-x-1.5 -translate-y-2 w-4 h-4 bg-white ' +
                  'border-3 border-slate-800 rounded-full'
                } />
              </div>
              <div className= 'flex flex-col items-center'>
                <span className= 'font-bold text-2xl text-slate-800'>
                  { formatCurrency( m.milestone, { ...display, decimals: 0 } ) }
                </span>
                <span className= 'font-medium text-sm text-slate-400'>
                  { m.year }
                </span>
              </div>
            </div>
          ) ) }
        </div>
      ) }

      { /** Masonry Grid */ }
      <div className= 'columns-1 md:columns-2 gap-8 space-y-8'>
        { /** Equivalents */ }
        <Card className= 'break-inside-avoid'>
          <Heading level= { 4 } className= 'flex items-center gap-4 mb-6'>
            <Scale size= { 20 } />
            <span>{ i18n.t( $ => $.stats.equivalents ) }</span>
          </Heading>
        </Card>

        { /** Working Hours */ }
        <Card className= 'break-inside-avoid'>
          <Heading level= { 4 } className= 'flex items-center gap-4 mb-6'>
            <BriefcaseBusiness size= { 20 } />
            <span>{ i18n.t( $ => $.stats.workingHrs ) }</span>
          </Heading>
        </Card>

        { /** Average Earnings */ }
        <Card className= 'break-inside-avoid'>
          <Heading level= { 4 } className= 'flex items-center gap-4 mb-6'>
            <PiggyBank size= { 20 } />
            <span>{ i18n.t( $ => $.stats.avgEarnings ) }</span>
          </Heading>
        </Card>
      </div>
    </div>
  );
};
