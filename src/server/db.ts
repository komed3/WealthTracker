import {
  CURRENCY_CONV, EQUIV_FACTOR, EQUIVALENTS,
  type STABILITY, type TREND, type VOLATILITY
} from '@/src/config/constants';
import type {
  Breakdown, ComputedData, Data, EntryRecord, EntryStats, Milestone,
  PortfolioStats, Settings, YearSnapshot
} from '@/src/types/data';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const DATA_FILE_PATH = resolve( process.cwd(), 'data', 'data.json' );

const DEFAULT_DATA: Data = {
  settings: {
    display: {
      language: 'en',
      currency: 'USD',
      decimals: 2
    },
    profile: {
      birthDate: '',
      gender: 'unspecified'
    }
  },
  entries: [],
  computed: {
    years: {},
    entries: {},
    portfolio: {
      firstYear: new Date().getFullYear(),
      lastYear: new Date().getFullYear(),
      latestNetWorth: 0,
      realValue: 0,
      nonRealValue: 0,
      inUSD: 0,
      milestones: [],
      count: {
        asset: 0,
        liability: 0,
        archived: 0,
        notional: 0
      }
    }
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export class Database {
  constructor ( private readonly filePath = DATA_FILE_PATH ) {}

  public initDb () : void {
    const dir = dirname( this.filePath );

    if ( ! existsSync( dir ) ) mkdirSync( dir, { recursive: true } );

    if ( ! existsSync( this.filePath ) ) {
      console.log( 'Creating central data file ...' );
      writeFileSync( this.filePath, JSON.stringify( DEFAULT_DATA, null, 2 ), 'utf-8' );
    }
  }

  public getData () : Data {
    this.initDb();

    const fileContent = readFileSync( this.filePath, 'utf-8' );
    return JSON.parse( fileContent ) as Data;
  }

  public saveData ( data: Data ) : void {
    const computed = this.compute( data.entries );
    const updatedData: Data = { ...data, computed, updatedAt: this.date() };

    writeFileSync( this.filePath, JSON.stringify( updatedData, null, 2 ), 'utf-8' );
  }

  public getSettings () : Settings {
    return this.getData().settings;
  }

  public saveSettings ( settings: Settings ) : Settings {
    const data = this.getData();
    const updatedData: Data = { ...data, settings, updatedAt: this.date() };

    this.saveData( updatedData );
    return settings;
  }

  private date () : string {
    return new Date().toISOString();
  }

  private compute ( entries: EntryRecord[] ) : ComputedData {
    const { decimals, currency } = this.getSettings().display;
    const entryStatsRecord: Record< string, EntryStats > = {};
    const yearSnapshots: Record< string, YearSnapshot > = {};

    const round = ( value: number ) => Number( value.toFixed( decimals ) );
    const roundOther = ( value: number ) => Number( value.toFixed( 5 ) );
    const percentage = ( value: number, total: number ) => total === 0 ? 0 : roundOther( Math.abs( value ) / total );

    const volatilityEval = ( vol: number ): VOLATILITY => {
      if ( vol <= 0.05 ) return 'veryLow';
      if ( vol <= 0.15 ) return 'low';
      if ( vol <= 0.3 ) return 'medium';
      if ( vol <= 0.6 ) return 'high';
      return 'veryHigh';
    };

    const stabilityEval = ( vol: number ): STABILITY => {
      if ( vol <= 0.05 ) return 'stable';
      if ( vol <= 0.15 ) return 'defensive';
      if ( vol <= 0.3 ) return 'balanced';
      if ( vol <= 0.6 ) return 'dynamic';
      return 'risky';
    };

    const trendEval = ( avgGrowth: number, returns: number[], vol: number ): TREND => {
      const positiveCount = returns.filter( r => r > 0 ).length;
      const negativeCount = returns.filter( r => r < 0 ).length;
      const signChanges = returns.slice( 1 ).reduce( ( count, value, index ) => {
        const previous = returns[ index ];
        return count + ( previous * value < 0 ? 1 : 0 );
      }, 0 );
      const signChangeRate = returns.length > 1 ? signChanges / ( returns.length - 1 ) : 0;

      if ( returns.length === 0 ) return 'stable';
      if ( vol <= 0.15 && Math.abs( avgGrowth ) <= 0.02 ) return 'stable';
      if ( avgGrowth > 0.02 && vol <= 0.3 && positiveCount / returns.length >= 0.75 ) return 'upward';
      if ( avgGrowth < -0.02 && vol <= 0.3 && negativeCount / returns.length >= 0.75 ) return 'downward';
      if ( signChangeRate >= 0.6 ) return 'cyclical';
      return 'unpredictable';
    };

    const portfolioSummary = {
      assetCount: 0, liabilityCount: 0, archivedCount: 0,
      nonRealCount: 0, realValue: 0, nonRealValue: 0
    };

    const annualReturnsByEntry: Record< string, number[] > = {};

    for ( const record of entries ) {
      const { entry, history } = record;
      const historyYears = Object.keys( history ).map( Number ).sort( ( a, b ) => a - b );
      const hasHistory = historyYears.length > 0;
      const firstYear = hasHistory ? historyYears[ 0 ] : new Date().getFullYear();
      const lastYear = hasHistory ? historyYears[ historyYears.length - 1 ] : firstYear;
      const firstVal = hasHistory ? round( history[ `${firstYear}` ].value ) : 0;
      const latestValue = hasHistory ? round( history[ `${lastYear}` ].value ) : 0;

      const values = hasHistory ? historyYears.map( year => history[ `${year}` ].value ) : [];
      const highestValue = values.length > 0 ? round( Math.max( ...values ) ) : undefined;
      const lowestValue = values.length > 0 ? round( Math.min( ...values ) ) : undefined;
      const averageValue = values.length > 0 ? round( values.reduce( ( sum, v ) => sum + v, 0 ) / values.length ) : undefined;

      const absoluteGrowth = round( latestValue - firstVal );
      const relativeGrowth = firstVal !== 0 ? roundOther( absoluteGrowth / firstVal ) : 0;

      const annualReturns = historyYears.length > 1 ? historyYears.slice( 1 ).map( ( year, index ) => {
        const previousYear = historyYears[ index ];
        const previousValue = history[ `${previousYear}` ].value;
        const currentValue = history[ `${year}` ].value;
        return previousValue !== 0 ? ( currentValue / previousValue ) - 1 : 0;
      } ) : [];

      annualReturnsByEntry[ entry.id ] = annualReturns;

      let volatility: number | undefined;
      if ( annualReturns.length > 1 ) {
        const meanReturn = annualReturns.reduce( ( sum, r ) => sum + r, 0 ) / annualReturns.length;
        const variance = annualReturns.reduce( ( sum, r ) => sum + Math.pow( r - meanReturn, 2 ), 0 ) / ( annualReturns.length - 1 );
        volatility = round( Math.sqrt( variance ) );
      } else if ( annualReturns.length === 1 ) {
        volatility = round( Math.abs( annualReturns[ 0 ] ) );
      }

      let averageAnnualGrowth: number | undefined;
      if ( historyYears.length > 1 ) {
        const yearsDiff = lastYear - firstYear;

        if ( yearsDiff > 0 && firstVal > 0 && latestValue > 0 ) {
          averageAnnualGrowth = roundOther( Math.pow( latestValue / firstVal, 1 / yearsDiff ) - 1 );
        }
      }

      entryStatsRecord[ entry.id ] = {
        entryId: entry.id, firstYear, lastYear, latestValue, highestValue,
        lowestValue, averageValue, volatility, averageAnnualGrowth,
        growth: historyYears.length > 1 ? {
          absolute: absoluteGrowth,
          relative: relativeGrowth
        } : undefined
      };

      if ( entry.archived ) portfolioSummary.archivedCount += 1;
      else {
        if ( entry.category === 'asset' ) portfolioSummary.assetCount += 1;
        else portfolioSummary.liabilityCount += 1;

        if ( entry.notional ?? false ) {
          portfolioSummary.nonRealCount += 1;
          portfolioSummary.nonRealValue += latestValue;
        } else {
          portfolioSummary.realValue += latestValue;
        }
      }
    }

    const allYearsSet = new Set < number > ();
    for ( const record of entries ) Object.keys( record.history ).forEach( y => allYearsSet.add( Number( y ) ) );

    const sortedYears = Array.from( allYearsSet ).sort( ( a, b ) => a - b );
    let prevNetWorth = 0;

    const relativeHistoryByEntry: Record< string, Record< `${number}`, number > > = {};
    for ( const record of entries ) {
      relativeHistoryByEntry[ record.entry.id ] = {};
    }

    const makeBreakdown = ( value: number, min: number, max: number, total: number ) : Breakdown => ( {
      value: round( value ), min: round( min ), max: round( max ), percentage: percentage( value, total )
    } );

    for ( const year of sortedYears ) {
      let assetsSum = 0, assetsMinSum = 0, assetsMaxSum = 0, liabilitiesSum = 0,
          liabilitiesMinSum = 0, liabilitiesMaxSum = 0;

      const exposures = {
        real: { assets: 0, assetsMin: 0, assetsMax: 0, liabilities: 0, liabilitiesMin: 0, liabilitiesMax: 0 },
        nonReal: { assets: 0, assetsMin: 0, assetsMax: 0, liabilities: 0, liabilitiesMin: 0, liabilitiesMax: 0 }
      };

      const byLiquidity: Record< number, { value: number; min: number; max: number } > = {};
      const byClass: Record< string, { value: number; min: number; max: number } > = {};

      for ( const record of entries ) {
        const valObj = record.history[ `${year}` ];
        if ( ! valObj ) continue;

        const val = valObj.value;
        const minVal = valObj.min !== undefined ? valObj.min : val;
        const maxVal = valObj.max !== undefined ? valObj.max : val;
        const isNonReal = record.entry.notional ?? false;
        const bucket = isNonReal ? exposures.nonReal : exposures.real;

        if ( record.entry.category === 'asset' ) {
          assetsSum += val;
          assetsMinSum += minVal;
          assetsMaxSum += maxVal;
          bucket.assets += val;
          bucket.assetsMin += minVal;
          bucket.assetsMax += maxVal;
        } else {
          liabilitiesSum += val;
          liabilitiesMinSum += minVal;
          liabilitiesMaxSum += maxVal;
          bucket.liabilities += val;
          bucket.liabilitiesMin += minVal;
          bucket.liabilitiesMax += maxVal;
        }

        const liq = record.entry.liquidity;
        if ( ! byLiquidity[ liq ] ) byLiquidity[ liq ] = { value: 0, min: 0, max: 0 };
        byLiquidity[ liq ].value += val;
        byLiquidity[ liq ].min += minVal;
        byLiquidity[ liq ].max += maxVal;

        const cls = record.entry.class;
        if ( ! byClass[ cls ] ) byClass[ cls ] = { value: 0, min: 0, max: 0 };
        byClass[ cls ].value += val;
        byClass[ cls ].min += minVal;
        byClass[ cls ].max += maxVal;
      }

      const netWorth = assetsSum - liabilitiesSum;
      const minNetWorth = assetsMinSum - liabilitiesMaxSum;
      const maxNetWorth = assetsMaxSum - liabilitiesMinSum;
      const totalValForPercentages = assetsSum + liabilitiesSum;

      const categoryBreakdown = {
        asset: makeBreakdown( assetsSum, assetsMinSum, assetsMaxSum, totalValForPercentages ),
        liability: makeBreakdown( liabilitiesSum, liabilitiesMinSum, liabilitiesMaxSum, totalValForPercentages )
      };

      const liquidityBreakdown: Record< number, Breakdown > = {};
      Object.entries( byLiquidity ).forEach( ( [ key, item ] ) => {
        liquidityBreakdown[ Number( key ) ] = makeBreakdown( item.value, item.min, item.max, assetsSum );
      } );

      const classBreakdown: Record< string, Breakdown > = {};
      Object.entries( byClass ).forEach( ( [ key, item ] ) => {
        const entryGroup = entries.find( r => r.entry.class === key );
        const divisor = entryGroup?.entry.category === 'asset' ? assetsSum : liabilitiesSum;
        classBreakdown[ key ] = makeBreakdown( item.value, item.min, item.max, divisor );
      } );

      const realValue = exposures.real.assets - exposures.real.liabilities;
      const realMin = exposures.real.assetsMin - exposures.real.liabilitiesMax;
      const realMax = exposures.real.assetsMax - exposures.real.liabilitiesMin;
      const nonRealValue = exposures.nonReal.assets - exposures.nonReal.liabilities;
      const nonRealMin = exposures.nonReal.assetsMin - exposures.nonReal.liabilitiesMax;
      const nonRealMax = exposures.nonReal.assetsMax - exposures.nonReal.liabilitiesMin;
      const exposureTotal = Math.abs( realValue ) + Math.abs( nonRealValue );

      let growthVal = undefined;
      if ( prevNetWorth !== 0 || sortedYears.indexOf( year ) > 0 ) {
        const absoluteGrowth = netWorth - prevNetWorth;
        const relativeGrowth = prevNetWorth !== 0 ? absoluteGrowth / prevNetWorth : 0;

        growthVal = {
          absolute: round( absoluteGrowth ),
          relative: roundOther( relativeGrowth )
        };
      }

      yearSnapshots[ String( year ) ] = {
        year,
        assets: round( assetsSum ),
        liabilities: round( liabilitiesSum ),
        netWorth: round( netWorth ),
        minNetWorth: round( minNetWorth ),
        maxNetWorth: round( maxNetWorth ),
        realization: {
          real: makeBreakdown( realValue, realMin, realMax, exposureTotal ),
          nonReal: makeBreakdown( nonRealValue, nonRealMin, nonRealMax, exposureTotal )
        },
        growth: growthVal,
        byCategory: categoryBreakdown,
        byLiquidity: liquidityBreakdown,
        byClass: classBreakdown
      };

      for ( const record of entries ) {
        const valObj = record.history[ `${year}` ];
        if ( ! valObj ) continue;

        const val = valObj.value;
        const total = record.entry.category === 'asset' ? assetsSum : liabilitiesSum;
        const percentageValue = total === 0 ? 0 : roundOther( val / total );
        relativeHistoryByEntry[ record.entry.id ][ String( year ) as `${number}` ] = percentageValue;
      }

      prevNetWorth = netWorth;
    }

    let firstYear = new Date().getFullYear(), lastYear = new Date().getFullYear(),
        latestNetWorth = 0, highestNetWorth = 0, lowestNetWorth = 0, totalGrowth = undefined,
        averageAnnualGrowth = 0, bestYear = undefined, worstYear = undefined;

    if ( sortedYears.length > 0 ) {
      firstYear = sortedYears[ 0 ];
      lastYear = sortedYears[ sortedYears.length - 1 ];
      latestNetWorth = yearSnapshots[ String( lastYear ) ].netWorth;

      const netWorthValues = Object.values( yearSnapshots ).map( s => s.netWorth );
      highestNetWorth = Math.max( ...netWorthValues );
      lowestNetWorth = Math.min( ...netWorthValues );

      const firstYearNetWorth = yearSnapshots[ String( firstYear ) ].netWorth;
      const absoluteTotalGrowth = latestNetWorth - firstYearNetWorth;
      const relativeTotalGrowth = firstYearNetWorth !== 0 ? absoluteTotalGrowth / firstYearNetWorth : 0;

      totalGrowth = {
        absolute: round( absoluteTotalGrowth ),
        relative: roundOther( relativeTotalGrowth )
      };

      if ( sortedYears.length > 1 ) {
        const yearsDiff = lastYear - firstYear;

        if ( yearsDiff > 0 && firstYearNetWorth > 0 && latestNetWorth > 0 ) {
          averageAnnualGrowth = roundOther( Math.pow( latestNetWorth / firstYearNetWorth, 1 / yearsDiff ) - 1 );
        }
      }

      let maxGrowth = -Infinity, minGrowth = Infinity;
      Object.values( yearSnapshots ).forEach( s => {
        if ( s.growth ) {
          if ( s.growth.absolute > maxGrowth ) {
            maxGrowth = s.growth.absolute;
            bestYear = s.year;
          }
          if ( s.growth.absolute < minGrowth ) {
            minGrowth = s.growth.absolute;
            worstYear = s.year;
          }
        }
      } );
    }

    const milestones: Milestone[] = [];
    if ( sortedYears.length > 0 ) {
      const milestoneCandidates: number[] = [];
      let power = 100;

      while ( power <= 100000000000 ) {
        milestoneCandidates.push( power );
        milestoneCandidates.push( power * 2.5 );
        milestoneCandidates.push( power * 5 );
        power *= 10;
      }

      milestoneCandidates.sort( ( a, b ) => a - b );

      const reachedMilestones = new Set< number >();
      for ( const year of sortedYears ) {
        const nw = yearSnapshots[ String( year ) ].netWorth;

        for ( const m of milestoneCandidates ) {
          if ( nw >= m && ! reachedMilestones.has( m ) ) {
            reachedMilestones.add( m );
            milestones.push( { milestone: m, year } );
          }
        }
      }

      milestones.sort( ( a, b ) => a.milestone - b.milestone );
    }

    const inUSD = latestNetWorth * CURRENCY_CONV[ currency ];
    const equivalents = Object.fromEntries( EQUIVALENTS.map( e => ( [
      e, round( inUSD * EQUIV_FACTOR[ e ] )
    ] ) ) ) as PortfolioStats[ 'equivalents' ];

    const globalPercentile = inUSD < 1e3 ? 100 - ( inUSD / 1e3 ) * 45
      : inUSD < 1e4 ? 55 - ( ( inUSD - 1e3 ) / 9e3 ) * 15
      : inUSD < 1e5 ? 40 - ( ( inUSD - 1e4 ) / 9e4 ) * 28
      : inUSD < 1e6 ? 12 - ( ( inUSD - 1e5 ) / 9e5 ) * 10.8
      : inUSD < 1e7 ? 1.2 - ( ( inUSD - 1e6 ) / 9e6 ) * 1.1
      : 0.1 - Math.min( 0.09, Math.log10( inUSD / 1e7 ) * 0.02 );

    const portfolioStats: PortfolioStats = {
      firstYear, lastYear,
      latestNetWorth: round( latestNetWorth ),
      highestNetWorth: round( highestNetWorth ),
      lowestNetWorth: round( lowestNetWorth ),
      realValue: round( portfolioSummary.realValue ),
      nonRealValue: round( portfolioSummary.nonRealValue ),
      totalGrowth, averageAnnualGrowth, bestYear, worstYear,
      milestones, equivalents, inUSD: round( inUSD ),
      globalPercentile: round( Math.max( 0.01, globalPercentile ) ),
      count: {
        asset: portfolioSummary.assetCount,
        liability: portfolioSummary.liabilityCount,
        archived: portfolioSummary.archivedCount,
        notional: portfolioSummary.nonRealCount
      }
    };

    for ( const record of entries ) {
      const entryId = record.entry.id;
      if ( entryStatsRecord[ entryId ] ) {
        const stats = entryStatsRecord[ entryId ];
        stats.relativeHistory = relativeHistoryByEntry[ entryId ];

        const effectiveVol = stats.volatility ?? 0;
        const averageGrowth = stats.averageAnnualGrowth ?? 0;
        const evaluation = {
          volatility: volatilityEval( effectiveVol ),
          stability: stabilityEval( effectiveVol ),
          trend: trendEval( averageGrowth, annualReturnsByEntry[ entryId ] ?? [], effectiveVol )
        };

        stats.evaluation = evaluation;
      }
    }

    return {
      years: yearSnapshots as Record< `${number}`, YearSnapshot >,
      entries: entryStatsRecord,
      portfolio: portfolioStats
    };
  }
}

const db = new Database();
export default db;
