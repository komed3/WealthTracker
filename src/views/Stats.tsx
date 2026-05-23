import { Card, InfoCard } from '@/src/components/ui/Card';
import { CustomTooltip, TooltipRow, xAxisInterval, yAxisFormatter } from '@/src/components/ui/Chart';
import { Heading } from '@/src/components/ui/Heading';
import { Intro } from '@/src/components/ui/Intro';
import { NoData } from '@/src/components/ui/NoData';
import { useData } from '@/src/context/DataCtx';
import { useIsMobile, useLayout } from '@/src/context/LayoutCtx';
import { formatCurrency, formatNumber, formatPercent, formatUnit } from '@/src/lib/formatter';
import i18n from '@/src/lib/i18n';
import { cn } from '@/src/lib/utils';
import { BriefcaseBusiness, ChartColumn, ChevronLeft, ChevronRight, Globe, PiggyBank, Scale } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Bar, BarChart, Rectangle, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const Stats = () => {
  const { setTitle } = useLayout();
  const isMobile = useIsMobile();
  const { data, settings } = useData();
  const display = settings!.display;

  useEffect( () => { setTitle( i18n.t( $ => $.stats.title ) ) }, [ setTitle, display.language ] );

  if ( data?.entries.length === 0 || ! data?.computed.portfolio ) return <NoData />;
  const { years, portfolio: stats } = data.computed;

  const [ hourlyWage, setHourlyWage ] = useState( 30 );
  const percent = ( ( hourlyWage - 5 ) / ( 500 - 5 ) ) * 100;

  const scrollRef = useRef < HTMLDivElement > ( null );
  const [ canScrollLeft, setCanScrollLeft ] = useState( false );
  const [ canScrollRight, setCanScrollRight ] = useState( false );

  const updateScrollButtons = () => {
    if ( scrollRef.current ) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      setCanScrollLeft( scrollLeft > 5 );
      setCanScrollRight( scrollLeft + clientWidth < scrollWidth - 5 );
    }
  };

  const scroll = ( direction: 'left' | 'right' ) => {
    if ( scrollRef.current ) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const firstChild = scrollRef.current.firstElementChild?.firstElementChild as HTMLElement;
      const itemWidth = firstChild ? firstChild.getBoundingClientRect().width : clientWidth / 5;
      const scrollAmount = itemWidth;

      let targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      targetScroll = Math.max( 0, Math.min( targetScroll, scrollWidth - clientWidth ) );

      scrollRef.current.scrollTo( { left: targetScroll, behavior: 'smooth' } );
    }
  };

  useEffect( () => {
    const timer = setTimeout( updateScrollButtons, 150 );
    window.addEventListener( 'resize', updateScrollButtons );

    return () => {
      clearTimeout( timer );
      window.removeEventListener( 'resize', updateScrollButtons );
    };
  }, [ data ] );

  const chartData = useMemo( () => Object.values( years ).sort( ( a, b ) => a.year - b.year ).map( y => ( {
    year: String( y.year ), raw: y, value: ( y.growth?.absolute ?? 0 ) / 365.25
  } ) ), [ stats ] );

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
      { stats.milestones && stats.milestones.length > 0 && (
        <div className= 'group/milestones relative w-full py-4'>
          { /** Scroll Container */ }
          <div
            ref= { scrollRef }
            onScroll= { updateScrollButtons }
            className= 'mx-12 py-6 overflow-x-auto scrollbar-none scroll-smooth'
            style= { { scrollbarWidth: 'none', msOverflowStyle: 'none' } }
          >
            <div className= 'flex gap-0 min-w-full'>
              { stats.milestones.slice().reverse().map( ( m, i ) => (
                <div key= { i } className= 'relative space-y-6 flex flex-col items-center shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5'>
                  <div className= 'relative flex justify-center items-center w-full h-8'>
                    { /** Horizontal Connector */ }
                    <div className= { cn(
                      'absolute top-1/2 translate-y-[-1.5px] h-0 border-t-3 border-slate-800',
                      i === 0 ? 'left-1/2 right-0' : i === stats.milestones.length - 1 ? 'left-0 right-1/2' : 'left-0 right-0'
                    ) } />
                    { /** Circle Indicator */ }
                    <div className= 'relative w-4 h-4 bg-white border-3 border-slate-800 rounded-full shadow-sm z-10' />
                  </div>
                  <div className= 'flex flex-col items-center text-center'>
                    <span className= 'font-mono font-semibold text-xl sm:text-2xl text-slate-800 tracking-tight'>
                      { formatCurrency( m.milestone, { ...display, decimals: 0 } ) }
                    </span>
                    <span className= 'font-medium text-xs sm:text-sm text-slate-400'>
                      { m.year }
                    </span>
                  </div>
                </div>
              ) ) }
            </div>
          </div>

          { /** Navigation Arrows */ }
          <button
            onClick= { () => scroll( 'left' ) }
            disabled= { ! canScrollLeft }
            className= { cn(
              'absolute z-20 left-0 top-14 -translate-y-1/2 flex justify-center items-center p-2',
              'text-slate-600 hover:text-primary bg-white border border-slate-200',
              'shadow hover:shadow-md rounded-full active:scale-95 transition-all duration-300',
              ! canScrollLeft
                ? 'pointer-events-none text-slate-500 bg-slate-100 opacity-50 shadow-none'
                : 'hover:scale-105 opacity-100'
            ) }
          >
            <ChevronLeft size= { 16 } />
          </button>

          <button
            onClick= { () => scroll( 'right' ) }
            disabled= { ! canScrollRight }
            className= { cn(
              'absolute z-20 right-0 top-14 -translate-y-1/2 flex justify-center items-center p-2',
              'text-slate-600 hover:text-primary bg-white border border-slate-200',
              'shadow hover:shadow-md rounded-full active:scale-95 transition-all duration-300',
              ! canScrollRight
                ? 'pointer-events-none text-slate-500 bg-slate-100 opacity-50 shadow-none'
                : 'hover:scale-105 opacity-100'
            ) }
          >
            <ChevronRight size= { 16 } />
          </button>
        </div>
      ) }

      { /** Annual Earnings */ }
      <Card>
        <Heading level= { 4 } className= 'flex items-center gap-4 mb-6'>
          <ChartColumn size= { 20 } />
          <span>{ i18n.t( $ => $.stats.annualEarnings ) }</span>
        </Heading>

        <ResponsiveContainer width= '100%' aspect= { 2 } maxHeight= { 320 }>
          <BarChart
            data= { chartData }
            margin= { { top: 10, right: 20, left: 20, bottom: 10 } }
          >
            <XAxis
              dataKey= 'year'
              interval= { xAxisInterval( { value: chartData.length, isMobile } ) }
              stroke= '#94a3b8'
              fontSize= { 12 }
              fontWeight= { 600 }
              tickLine= { false }
              axisLine= { false }
              dy= { 10 }
            />
            <YAxis
              hide= { isMobile }
              tickFormatter= { ( value: number ) => yAxisFormatter( {
                type: 'currency', value, display
              } ) }
              stroke= '#94a3b8'
              fontSize= { 12 }
              fontWeight= { 600 }
              tickLine= { false }
              axisLine= { false }
              dx= { -10 }
            />
            <Tooltip
              content= { ( { active, payload } ) => {
                if ( active && payload && payload.length ) {
                  const dataPoint = payload[ 0 ].payload;
                  const growth = Math.abs( dataPoint.raw.growth?.absolute ?? 0 );
                  const isPositive = dataPoint.value >= 0;

                  return (
                    <CustomTooltip
                      label= { dataPoint.year }
                      value= { ( <div className= 'space-x-1'>
                        <span style= { { color: isPositive ? '#10b981' : '#ef4444' } } >
                          { formatCurrency( Math.abs( dataPoint.value ), display ) }
                        </span>
                        <span className= 'font-sans text-xs'> / { i18n.t( $ => $.period.day ) }</span>
                      </div> ) }
                    >
                      <TooltipRow
                        label= { i18n.t( $ => $.period.month ) }
                        value= { formatCurrency( growth / 12, display ) }
                      />
                      <TooltipRow
                        label= { i18n.t( $ => $.period.week ) }
                        value= { formatCurrency( growth / 52.1775, display ) }
                      />
                      <TooltipRow
                        label= { i18n.t( $ => $.period.hour ) }
                        value= { formatCurrency( growth / 8766, display ) }
                      />
                      <TooltipRow
                        label= { i18n.t( $ => $.period.minute ) }
                        value= { formatCurrency( growth / 525960, display ) }
                      />
                    </CustomTooltip>
                  );
                }
              } }
              cursor= { { fill: 'oklch(98.4% 0.003 247.858)' } }
            />
            <ReferenceLine
              y= { 0 }
              stroke= '#cbd5e1'
              strokeWidth= { 2 }
              style= { { opacity: 0.6 } }
            />
            <Bar
              dataKey= 'value'
              shape= { ( props ) => {
                const { payload } = props;
                const isPositive = payload.value >= 0;

                return (
                  <Rectangle
                    { ...props }
                    className= 'transition-all duration-300'
                    fill= { isPositive ? '#10b981' : '#ef4444' }
                    radius= { [ 6, 6, 0, 0 ] }
                  />
                );
              } }
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      { /** Masonry Grid */ }
      <div className= 'columns-1 md:columns-2 gap-8 space-y-8'>
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
              <span className= 'font-semibold text-primary text-lg'>
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
              onChange= { ( e ) => setHourlyWage( Number( e.target.value ) ) }
              className= {
                'w-full h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none ' +
                '[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full ' +
                '[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 ' +
                '[&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:shadow-md ' +
                '[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full ' +
                '[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 ' +
                '[&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:shadow-md'
              }
              style= { { background: `linear-gradient(to right, #2563eb ${percent}%, #e2e8f0 ${percent}%)` } }
            />
          </div>

          { /** Calculated Results */ }
          <div className= 'space-y-3'>
            <div className= 'flex justify-between items-baseline gap-4'>
              <span className= 'min-w-0 truncate text-sm text-slate-500'>
                { i18n.t( $ => $.stats.workingHrs ) }
              </span>
              <span className= 'font-semibold text-2xl text-slate-800'>
                { formatUnit( 'hour', stats.inUSD / hourlyWage, { ...display, decimals: 0 } ) }
              </span>
            </div>
            <div className= 'flex justify-between items-baseline gap-4'>
              <span className= 'min-w-0 truncate text-sm text-slate-500'>
                { i18n.t( $ => $.stats.workingDays ) }
              </span>
              <span className= 'font-medium text-lg text-slate-600'>
                { formatUnit( 'day', stats.inUSD / hourlyWage / 8, { ...display, decimals: 0 } ) }
              </span>
            </div>
            <div className= 'flex justify-between items-baseline gap-4'>
              <span className= 'min-w-0 truncate text-sm text-slate-500'>
                { i18n.t( $ => $.stats.workingWeeks ) }
              </span>
              <span className= 'font-medium text-lg text-slate-600'>
                { formatUnit( 'week', stats.inUSD / hourlyWage / 40, { ...display, decimals: 0 } ) }
              </span>
            </div>
            <div className= 'flex justify-between items-baseline gap-4'>
              <span className= 'min-w-0 truncate text-sm text-slate-500'>
                { i18n.t( $ => $.stats.workingMonths ) }
              </span>
              <span className= 'font-medium text-lg text-slate-600'>
                { formatUnit( 'month', stats.inUSD / hourlyWage / 160, { ...display, decimals: 0 } ) }
              </span>
            </div>
            <div className= 'flex justify-between items-baseline gap-4'>
              <span className= 'min-w-0 truncate text-sm text-slate-500'>
                { i18n.t( $ => $.stats.workingYears ) }
              </span>
              <span className= 'font-medium text-lg text-slate-600'>
                { formatUnit( 'year', stats.inUSD / hourlyWage / 1840, { ...display, decimals: 0 } ) }
              </span>
            </div>
          </div>
        </Card>

        { /** Living Expenses */ }
        { stats.expenses && (
          <Card className= 'break-inside-avoid'>
            <Heading level= { 4 } className= 'flex items-center gap-4 mb-6'>
              <Globe size= { 20 } />
              <span>{ i18n.t( $ => $.stats.expenses ) }</span>
            </Heading>
            <p>{ i18n.t( $ => $.stats.expensesInfo ) }</p>
            <div className= 'my-6 border-t-2 border-dashed border-slate-300' />
            <div className= 'space-y-4'>
              { Object.entries( stats.expenses ).map( ( [ c, v ] ) => (
                <div key= { c } className= 'space-y-1'>
                  <div className= 'flex justify-between items-baseline gap-4'>
                    <span className= 'min-w-0 truncate text-sm text-slate-800'>
                      { i18n.t( $ => $.country[ c as keyof typeof $.country ] ) }
                    </span>
                    <span className= 'font-medium text-xl text-slate-800'>
                      { formatUnit( 'month', v, { ...display, decimals: 0 } ) }
                    </span>
                  </div>
                  <div className= 'h-2 bg-slate-200 rounded-full overflow-hidden'>
                    <div
                      className= 'h-2 bg-primary transition-all duration-300'
                      style= { { width: `${ v / stats.expenses!.in * 100 }%` } }
                    />
                  </div>
                </div>
              ) ) }
            </div>
          </Card>
        ) }
        
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
                <span className= 'font-mono font-semibold text-2xl text-slate-800'>
                  { formatUnit( 'gram', stats.equivalents.gold, display ) }
                </span>
              </div>
              <div className= 'flex justify-between items-baseline gap-4'>
                <span className= 'min-w-0 truncate text-sm text-slate-500'>
                  { i18n.t( $ => $.equivalent.coinStack ) }
                </span>
                <span className= 'font-mono font-semibold text-2xl text-slate-800'>
                  { formatUnit( 'meter', stats.equivalents.coinStack, display ) }
                </span>
              </div>
              <div className= 'flex justify-between items-baseline gap-4'>
                <span className= 'min-w-0 truncate text-sm text-slate-500'>
                  { i18n.t( $ => $.equivalent.savings ) }
                </span>
                <span className= 'font-mono font-semibold text-2xl text-slate-800'>
                  { formatPercent( stats.equivalents.savings, display ) }
                </span>
              </div>
              <div className= 'flex justify-between items-baseline gap-4'>
                <span className= 'min-w-0 truncate text-sm text-slate-500'>
                  { i18n.t( $ => $.equivalent.income ) }
                </span>
                <span className= 'font-mono font-semibold text-2xl text-slate-800'>
                  { formatPercent( stats.equivalents.income, display ) }
                </span>
              </div>
              <div className= 'flex justify-between items-baseline gap-4'>
                <span className= 'min-w-0 truncate text-sm text-slate-500'>
                  { i18n.t( $ => $.equivalent.burger ) }
                </span>
                <span className= 'font-mono font-semibold text-2xl text-slate-800'>
                  { formatNumber( stats.equivalents.burger, { ...display, decimals: 0 } ) }
                </span>
              </div>
            </div>
          </Card>
        ) }

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
                  <span className= 'font-mono font-semibold text-2xl text-slate-800'>
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
