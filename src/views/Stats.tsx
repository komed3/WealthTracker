import { Intro } from '@/src/components/ui/Intro';
import { NoData } from '@/src/components/ui/NoData';
import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import { formatCurrency } from '@/src/lib/formatter';
import i18n from '@/src/lib/i18n';
import { useEffect } from 'react';

export const Stats = () => {
  const { data, settings } = useData();
  const { setTitle } = useLayout();
  const display = settings!.display;

  useEffect( () => { setTitle( i18n.t( $ => $.stats.title ) ) }, [ setTitle, display.language ] );

  if ( data?.entries.length === 0 || ! data?.computed.portfolio ) return <NoData />;
  const { milestones } = data.computed.portfolio;

  return (
    <div className= 'space-y-8'>
      { /** Page Header */ }
      <Intro
        title= { i18n.t( $ => $.stats.title ) }
        description= { i18n.t( $ => $.stats.description ) }
      />

      { /** Milestones */ }
      { milestones && (
        <div className= 'flex py-6'>
          { milestones.slice( -6 ).map( ( m, i ) => (
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
    </div>
  );
};
