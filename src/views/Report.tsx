import { Card, InfoCard } from '@/src/components/ui/Card';
import { Heading } from '@/src/components/ui/Heading';
import { Intro } from '@/src/components/ui/Intro';
import { NoData } from '@/src/components/ui/NoData';
import { Select } from '@/src/components/ui/Select';
import { ASSET_CLASS, LIABILITY_CLASS, type LIQUIDITY } from '@/src/config/constants';
import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import { formatCurrency, formatPercent } from '@/src/lib/formatter';
import i18n from '@/src/lib/i18n';
import { cn } from '@/src/lib/utils';
import type { ClassReportProps, ReportRowProps } from '@/src/types/props';
import { BookOpenText, CircleAlert, Layers3, PiggyBank, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';

const ReportRow = ( { label, value, percentage, display }: ReportRowProps ) => {
  return ( <div className= 'space-y-1'>
    <div className= 'flex justify-between items-baseline'>
      <span className= 'min-w-0 truncate font-medium text-sm text-slate-800'>
        { label }
      </span>
      <div className= 'flex items-baseline gap-3 font-mono'>
        <span className= 'text-lg font-bold'>
          { formatCurrency( value, display ) }
        </span>
        <span className= 'text-sm'>
          ({ formatPercent( percentage, display ) })
        </span>
      </div>
    </div>
    <div className= 'h-2 bg-slate-200 rounded-full overflow-hidden'>
      <div
        className= 'h-2 bg-primary transition-all duration-300'
        style= { { width: `${ percentage * 100 }%` } }
      />
    </div>
  </div> );
};

const ClassReport = ( { type, breakdown, display }: ClassReportProps ) => {
  const items = Object.entries( breakdown ).map( ( [ k, r ] ) => {
    if ( type === 'asset' && ASSET_CLASS.includes( k as any ) )
      return [ i18n.t( $ => $.assetClass[ k as ASSET_CLASS ] ), r ];
    else if ( type === 'liability' && LIABILITY_CLASS.includes( k as any ) )
      return [ i18n.t( $ => $.liabilityClass[ k as LIABILITY_CLASS ] ), r ];
    return null;
  } ).filter( Boolean );

  return items.length === 0 ? (
    <p className= 'py-16 text-center font-medium text-sm text-slate-400'>
      { i18n.t( $ => $.report.noData ) }
    </p>
  ) : (
    <div className= 'space-y-3'>
      { items.map( ( [ label, { value, percentage } ]: any, key ) => (
        <ReportRow
          key= { key }
          label= { label }
          value= { value }
          percentage= { percentage }
          display= { display }
        />
      ) ) }
    </div>
  );
};

export const Report = () => {
  const { data, settings } = useData();
  const { setTitle } = useLayout();
  const display = settings!.display;

  useEffect( () => { setTitle( i18n.t( $ => $.report.title ) ) }, [ setTitle, display.language ] );

  const sortedYears = useMemo(
    () => Object.values( data?.computed.years ?? {} ).map( s => s.year ).sort( ( a, b ) => a - b ),
    [ data ]
  );

  if ( ! data || sortedYears.length === 0 ) return <NoData />;

  const yearOptions = useMemo( () => sortedYears.slice().reverse().map( y => ( {
    value: String( y ), label: String( y )
  } ) ), [ sortedYears ] );

  const [ selectedYear, setSelectedYear ] = useState < number > ( sortedYears[ sortedYears.length - 1 ] );

  const snapshot = useMemo(
    () => data.computed.years[ String( selectedYear ) as `${number}` ] || null,
    [ data, selectedYear ]
  );

  const positions = useMemo( () => data.entries.map( p => {
    const h = p.history[ String( selectedYear ) as `${number}` ];
    if ( h ) return { entry: p.entry, data: h };
  } ).filter( Boolean ), [ data, selectedYear ] );

  const trendUp = ( snapshot.growth?.absolute ?? 0 ) >= 0;

  return (
    <div className= 'space-y-8'>
      { /** Page Header */ }
      <Intro
        title= { i18n.t( $ => $.report.title ) }
        description= { i18n.t( $ => $.report.description, { year: selectedYear } ) }
      >
        <div className= 'shrink-0 min-w-36'>
          <Select
            value= { String( selectedYear ) }
            options= { yearOptions }
            onChange= { ( e ) => setSelectedYear( Number( e.target.value ) ) }
          />
        </div>
      </Intro>

      { /** Key Metrics */ }
      <div className= 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 w-full'>
        <InfoCard
          label= { i18n.t( $ => $.report.totalAssets ) }
          value= { formatCurrency( snapshot.netWorth, display ) }
        />
        <InfoCard
          label= { i18n.t( $ => $.report.real ) }
          value= { formatCurrency( snapshot.realization.real.value, display ) }
        />
        <InfoCard
          label= { i18n.t( $ => $.report.liabilities ) }
          value= { formatCurrency( snapshot.liabilities, display ) }
        />
        <InfoCard
          label= { i18n.t( $ => $.report.netWorth ) }
          value= { formatCurrency( snapshot.assets, display ) }
        />
      </div>

      { /** Annual Growth */ }
      { snapshot.growth && (
        <div className= 'flex justify-between items-center gap-6 p-4 border-2 border-dashed border-slate-200/80 rounded-2xl'>
          <div className= 'flex items-center gap-4 min-w-0'>
            <div className= { cn(
              'flex justify-center items-center shrink-0 w-10 h-10 text-white rounded-xl',
              trendUp ? 'bg-pos' : 'bg-neg'
            ) }>
              { trendUp ? <TrendingUp size= { 22 } /> : <TrendingDown size= { 22 } /> }
            </div>
            <span className= 'hidden sm:block font-medium'>
              { i18n.t( $ => $.report.trend ) }
            </span>
          </div>
          <div className= 'flex items-baseline gap-4 shrink-0 font-mono'>
            <span className= { cn( 'text-xl font-black', trendUp ? 'text-pos' : 'text-neg' ) }>
              { formatCurrency( snapshot.growth.absolute, display ) }
            </span>
            <span>({ formatPercent( snapshot.growth.relative, display ) })</span>
          </div>
        </div>
      ) }

      { /** Net Worth Range */ }
      { ( () => {
        if ( snapshot.maxNetWorth && snapshot.minNetWorth ) {
          const max = Math.abs( snapshot.maxNetWorth - snapshot.netWorth ),
                min = Math.abs( snapshot.minNetWorth - snapshot.netWorth ),
                range = Math.max( max, min ) * 1.15;

          return (
            <div className= 'flex flex-col items-center gap-2 p-4'>
              <div className= 'self-stretch flex flex-col xl:flex-row justify-between items-center gap-6'>
                <div className= 'shrink-0 flex flex-col items-center xl:items-end w-48 text-center xl:text-right'>
                  <span className= 'font-mono font-bold text-lg'>
                    { formatCurrency( snapshot.minNetWorth, display ) }
                  </span>
                  <span className= 'uppercase font-bold text-[12px] text-slate-400 tracking-wider'>
                    { i18n.t( $ => $.report.minimum ) }
                  </span>
                </div>
                <div className= 'flex-1 w-full'>
                  <div className= 'relative h-2 bg-slate-200 rounded-full'>
                    <div
                      className= 'absolute right-[50%] h-2 bg-neg transition-all duration-300'
                      style= { { width: `${ min / range * 50 }%` } }
                    >
                      <div className= {
                        'absolute left-0 -translate-x-3 -translate-y-2 w-6 h-6 bg-white ' +
                        'border-2 border-neg rounded-full'
                      } />
                    </div>
                    <div
                      className= 'absolute left-[50%] h-2 bg-pos transition-all duration-300'
                      style= { { width: `${ max / range * 50 }%` } }
                    >
                      <div className= {
                        'absolute right-0 translate-x-3 -translate-y-2 w-6 h-6 bg-white ' +
                        'border-2 border-pos rounded-full'
                      } />
                    </div>
                    <div className= {
                      'absolute left-[50%] -translate-x-1 -translate-y-4 w-1.5 h-10 ' +
                      'bg-slate-50 xl:bg-slate-300 border-2 border-slate-50'
                    } />
                  </div>
                </div>
                <div className= 'shrink-0 flex flex-col items-center xl:items-start w-48 text-center xl:text-left'>
                  <span className= 'font-mono font-bold text-lg'>
                    { formatCurrency( snapshot.maxNetWorth, display ) }
                  </span>
                  <span className= 'uppercase font-bold text-[12px] text-slate-400 tracking-wider'>
                    { i18n.t( $ => $.report.maximum ) }
                  </span>
                </div>
              </div>
              <div className= 'hidden xl:flex flex-col items-center text-center'>
                <span className= 'font-mono font-bold text-xl'>
                  { formatCurrency( snapshot.netWorth, display ) }
                </span>
                <span className= 'uppercase font-bold text-[12px] text-slate-400 tracking-wider'>
                  { i18n.t( $ => $.report.netWorth ) }
                </span>
              </div>
            </div>
          )
        }
      } )() }

      { /** Assets / Positions List */ }
      { positions && (
        <div className= 'flex flex-col w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden'>
          <div className= 'whitespace-nowrap overflow-x-auto'>
            <table className= 'w-full text-left text-sm text-slate-800 border-collapse'>
              <thead>
                <tr className= 'uppercase font-semibold text-xs text-slate-500 tracking-wider bg-slate-50 border-b border-slate-200'>
                  <th className= 'px-6 py-4'>{ i18n.t( $ => $.report.asset ) }</th>
                  <th className= 'px-6 py-4'>{ i18n.t( $ => $.report.category ) }</th>
                  <th className= 'px-6 py-4'>{ i18n.t( $ => $.report.class ) }</th>
                  <th className= 'px-6 py-4'>{ i18n.t( $ => $.report.liquidity ) }</th>
                  <th className= 'px-6 py-4 text-right'>{ i18n.t( $ => $.report.value ) }</th>
                  <th className= 'px-6 py-4 text-right'>{ i18n.t( $ => $.report.minimum ) }</th>
                  <th className= 'px-6 py-4 text-right'>{ i18n.t( $ => $.report.maximum ) }</th>
                </tr>
              </thead>
              <tbody className= 'divide-y divide-dashed divide-slate-200'>
                { positions.map( item => item && (
                  <tr key= { item.entry.id } className= 'h-16 align-middle'>
                    <td className= 'px-6 py-4 font-semibold text-sm text-slate-800'>
                      <Link to= { `/asset/${ item.entry.id }` } className= 'flex items-center gap-2'>
                        <div
                          className= 'shrink-0 w-3 h-3 rounded-full'
                          style= { { backgroundColor: item.entry.color } }
                        />
                        <span>{ item.entry.title }</span>
                      </Link>
                    </td>
                    <td className= 'px-6 py-4 text-sm text-slate-800'>
                      { i18n.t( $ => $.category[ item.entry.category ] ) }
                    </td>
                    <td className= 'px-6 py-4 text-sm text-slate-800'>
                      { i18n.t( $ => ( $[ item.entry.category === 'asset' ? 'assetClass' : 'liabilityClass' ] as any )[ item.entry.class ] ) }
                    </td>
                    <td className= 'px-6 py-4 text-sm text-slate-800'>
                      { i18n.t( $ => $.liquidity[ item.entry.liquidity ] ) }
                    </td>
                    <td className= 'px-6 py-4 text-right font-mono text-lg font-semibold text-slate-900'>
                      { formatCurrency( item.data.value, display ) }
                    </td>
                    <td className= 'px-6 py-4 text-right font-mono text-sm font-semibold text-slate-800'>
                      { item.data.min ? formatCurrency( item.data.min, display ) : '—' }
                    </td>
                    <td className= 'px-6 py-4 text-right font-mono text-sm font-semibold text-slate-800'>
                      { item.data.max ? formatCurrency( item.data.max, display ) : '—' }
                    </td>
                  </tr>
                ) ) }
              </tbody>
            </table>
          </div>
        </div>
      ) }

      { /** Masonry Grid */ }
      <div className= 'columns-1 md:columns-2 gap-8 space-y-8'>
        { /** Assets */ }
        <Card className= 'break-inside-avoid'>
          <Heading level= { 4 } className= 'flex items-center gap-4 mb-6'>
            <Layers3 size= { 20 } />
            <span>{ i18n.t( $ => $.report.assets ) }</span>
          </Heading>
          <ClassReport
            type= 'asset'
            breakdown= { snapshot.byClass }
            display= { display }
          />
        </Card>

        { /** Liabilities */ }
        <Card className= 'break-inside-avoid'>
          <Heading level= { 4 } className= 'flex items-center gap-4 mb-6'>
            <CircleAlert size= { 20 } />
            <span>{ i18n.t( $ => $.report.liabilities ) }</span>
          </Heading>
          <ClassReport
            type= 'liability'
            breakdown= { snapshot.byClass }
            display= { display }
          />
        </Card>

        { /** Liquidity */ }
        <Card className= 'break-inside-avoid'>
          <Heading level= { 4 } className= 'flex items-center gap-4 mb-6'>
            <PiggyBank size= { 20 } />
            <span>{ i18n.t( $ => $.report.liquidity ) }</span>
          </Heading>
          <div className= 'space-y-3'>
            { Object.entries( snapshot.byLiquidity ).map( ( [ liq, { value, percentage } ], index ) => (
              <ReportRow
                key= { index }
                label= { i18n.t( $ => $.liquidity[ liq as unknown as LIQUIDITY ] ) }
                value= { value }
                percentage= { percentage }
                display= { display }
              />
            ) ) }
          </div>
        </Card>

        { /** Realization */ }
        <Card className= 'break-inside-avoid'>
          <Heading level= { 4 } className= 'flex items-center gap-4 mb-6'>
            <BookOpenText size= { 20 } />
            <span>{ i18n.t( $ => $.report.realization ) }</span>
          </Heading>
          <div className= 'space-y-3'>
            <ReportRow
              key= { 'real' }
              label= { i18n.t( $ => $.report.real ) }
              value= { snapshot.realization.real.value }
              percentage= { snapshot.realization.real.percentage }
              display= { display }
            />
            <ReportRow
              key= { 'notional' }
              label= { i18n.t( $ => $.report.notional ) }
              value= { snapshot.realization.nonReal.value }
              percentage= { snapshot.realization.nonReal.percentage }
              display= { display }
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
