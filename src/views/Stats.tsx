import { Card, InfoCard } from '@/src/components/ui/Card';
import { Heading } from '@/src/components/ui/Heading';
import { Intro } from '@/src/components/ui/Intro';
import { NoData } from '@/src/components/ui/NoData';
import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import { formatCurrency, formatNumber, formatPercent, formatUnit } from '@/src/lib/formatter';
import i18n from '@/src/lib/i18n';
import { BriefcaseBusiness, PiggyBank, Scale } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export const Stats = () => {
  const { data, settings } = useData();
  const { setTitle } = useLayout();
  const display = settings!.display;

  useEffect( () => { setTitle( i18n.t( $ => $.stats.title ) ) }, [ setTitle, display.language ] );

  const [ hourlyWage, setHourlyWage ] = useState( 30 );
  const percent = ( ( hourlyWage - 5 ) / ( 500 - 5 ) ) * 100;

  if ( data?.entries.length === 0 || ! data?.computed.portfolio ) return <NoData />;
  const stats = data.computed.portfolio;

  const avgEarnings = useMemo( () => {
    if ( ! settings?.profile?.birthDate ) return ;
    try {
      const year = stats?.lastYear || new Date().getFullYear();
      const refTime = new Date( year, 11, 31 ).getTime();
      const birthTime = new Date( settings?.profile?.birthDate ).getTime();
      const ageInMs = refTime - birthTime;
      const ageInYears = ageInMs / ( 1000 * 60 * 60 * 24 * 365.25 );

      return {
        year: stats.latestNetWorth / ageInYears,
        month: stats.latestNetWorth / ( ageInYears * 12 ),
        week: stats.latestNetWorth / ( ageInYears * 52.1775 ),
        day: stats.latestNetWorth / ( ageInMs / ( 1000 * 24 * 3600 ) ),
        hour: stats.latestNetWorth / ( ageInMs / ( 1000 * 3600 ) ),
        minute: stats.latestNetWorth / ( ageInMs / ( 1000 * 60 ) )
      };
    } catch {}
  }, [ stats, settings ] );

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
        { stats.equivalents && (
          <Card className= 'break-inside-avoid'>
            <Heading level= { 4 } className= 'flex items-center gap-4 mb-6'>
              <Scale size= { 20 } />
              <span>{ i18n.t( $ => $.stats.equivalents ) }</span>
            </Heading>
            <p>{ i18n.t( $ => $.stats.equivalentsInfo ) }</p>
            <div className= 'my-6 border-t-2 border-dashed border-slate-300' />
            <div className= 'space-y-3'>
              <div className= 'flex justify-between items-baseline gap-4'>
                <span className= 'min-w-0 truncate text-sm text-slate-500'>
                  { i18n.t( $ => $.equivalent.gold ) }
                </span>
                <span className= 'font-mono font-bold text-2xl text-slate-800'>
                  { formatUnit( 'gram', stats.equivalents.gold, display ) }
                </span>
              </div>
              <div className= 'flex justify-between items-baseline gap-4'>
                <span className= 'min-w-0 truncate text-sm text-slate-500'>
                  { i18n.t( $ => $.equivalent.coinStack ) }
                </span>
                <span className= 'font-mono font-bold text-2xl text-slate-800'>
                  { formatUnit( 'meter', stats.equivalents.coinStack, display ) }
                </span>
              </div>
              <div className= 'flex justify-between items-baseline gap-4'>
                <span className= 'min-w-0 truncate text-sm text-slate-500'>
                  { i18n.t( $ => $.equivalent.savings ) }
                </span>
                <span className= 'font-mono font-bold text-2xl text-slate-800'>
                  { formatPercent( stats.equivalents.savings, display ) }
                </span>
              </div>
              <div className= 'flex justify-between items-baseline gap-4'>
                <span className= 'min-w-0 truncate text-sm text-slate-500'>
                  { i18n.t( $ => $.equivalent.income ) }
                </span>
                <span className= 'font-mono font-bold text-2xl text-slate-800'>
                  { formatPercent( stats.equivalents.income, display ) }
                </span>
              </div>
              <div className= 'flex justify-between items-baseline gap-4'>
                <span className= 'min-w-0 truncate text-sm text-slate-500'>
                  { i18n.t( $ => $.equivalent.burger ) }
                </span>
                <span className= 'font-mono font-bold text-2xl text-slate-800'>
                  { formatNumber( stats.equivalents.burger, { ...display, decimals: 0 } ) }
                </span>
              </div>
            </div>
          </Card>
        ) }

        { /** Working Hours */ }
        <Card className= 'break-inside-avoid'>
          <Heading level= { 4 } className= 'flex items-center gap-4 mb-6'>
            <BriefcaseBusiness size= { 20 } />
            <span>{ i18n.t( $ => $.stats.workingHrs ) }</span>
          </Heading>
          <p className= 'mb-6'>
            { i18n.t( $ => $.stats.workingHrsInfo ) }
          </p>

          { /** Wage Slider */ }
          <div className= 'space-y-4 mb-6 p-4 rounded-xl border-2 border-dashed border-slate-200'>
            <div className= 'flex justify-between items-center text-sm'>
              <span className= 'min-w-0 truncate text-sm text-slate-500'>
                { i18n.t( $ => $.stats.hourlyWageLabel ) }
              </span>
              <span className= 'font-bold text-primary text-lg'>
                { i18n.t( $ => $.stats.hourlyWage, {
                  value: formatCurrency( hourlyWage, { ...display, currency: 'USD', decimals: 0 } )
                } ) }
              </span>
            </div>
            <input
              type= 'range'
              min= { 5 }
              max= { 500 }
              step= { 5 }
              value= { hourlyWage }
              onChange={ ( e ) => setHourlyWage( Number( e.target.value ) ) }
              className= {
                'w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none ' +
                '[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full ' +
                '[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 ' +
                '[&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md ' +
                '[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full ' +
                '[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 ' +
                '[&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:shadow-md'
              }
              style={ { background: `linear-gradient(to right, #2563eb ${percent}%, #e2e8f0 ${percent}%)` } }
            />
          </div>

          { /** Calculated Results */ }
          <div className= 'space-y-3'>
            <div className= 'flex justify-between items-baseline gap-4'>
              <span className= 'min-w-0 truncate text-sm text-slate-500'>
                { i18n.t( $ => $.stats.workingHrs ) }
              </span>
              <span className= 'font-mono font-bold text-2xl text-slate-800'>
                { formatUnit( 'hour', stats.inUSD / hourlyWage, { ...display, decimals: 0 } ) }
              </span>
            </div>
            <div className= 'flex justify-between items-baseline gap-4'>
              <span className= 'min-w-0 truncate text-sm text-slate-500'>
                { i18n.t( $ => $.stats.workingDays ) }
              </span>
              <span className= 'font-mono font-medium text-lg text-slate-600'>
                { formatUnit( 'day', stats.inUSD / hourlyWage / 8, { ...display, decimals: 0 } ) }
              </span>
            </div>
            <div className= 'flex justify-between items-baseline gap-4'>
              <span className= 'min-w-0 truncate text-sm text-slate-500'>
                { i18n.t( $ => $.stats.workingWeeks ) }
              </span>
              <span className= 'font-mono font-medium text-lg text-slate-600'>
                { formatUnit( 'week', stats.inUSD / hourlyWage / 40, { ...display, decimals: 0 } ) }
              </span>
            </div>
            <div className= 'flex justify-between items-baseline gap-4'>
              <span className= 'min-w-0 truncate text-sm text-slate-500'>
                { i18n.t( $ => $.stats.workingMonths ) }
              </span>
              <span className= 'font-mono font-medium text-lg text-slate-600'>
                { formatUnit( 'month', stats.inUSD / hourlyWage / 160, { ...display, decimals: 0 } ) }
              </span>
            </div>
            <div className= 'flex justify-between items-baseline gap-4'>
              <span className= 'min-w-0 truncate text-sm text-slate-500'>
                { i18n.t( $ => $.stats.workingYears ) }
              </span>
              <span className= 'font-mono font-medium text-lg text-slate-600'>
                { formatUnit( 'year', stats.inUSD / hourlyWage / 1840, { ...display, decimals: 0 } ) }
              </span>
            </div>
          </div>
        </Card>

        { /** Average Earnings */ }
        { avgEarnings && (
          <Card className= 'break-inside-avoid'>
            <Heading level= { 4 } className= 'flex items-center gap-4 mb-6'>
              <PiggyBank size= { 20 } />
              <span>{ i18n.t( $ => $.stats.avgEarnings ) }</span>
            </Heading>
            <p>{ i18n.t( $ => $.stats.avgEarningsInfo ) }</p>
            <div className= 'my-6 border-t-2 border-dashed border-slate-300' />
            <div className= 'space-y-3'>
              { Object.entries( avgEarnings ).map( ( [ p, v ] ) => (
                <div key= { p } className= 'flex justify-between items-baseline gap-4'>
                  <span className= 'min-w-0 truncate text-sm text-slate-500'>
                    { i18n.t( $ => $.period[ p as keyof typeof $.period ] ) }
                  </span>
                  <span className= 'font-mono font-bold text-2xl text-slate-800'>
                    { formatCurrency( v, display ) }
                  </span>
                </div>
              ) ) }
            </div>
          </Card>
        ) }
      </div>
    </div>
  );
};
