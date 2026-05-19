import type { Breakdown, ComputedData, Data, EntryRecord, EntryStats, PortfolioStats, Settings, YearSnapshot } from '@/src/types/data';
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
      assetCount: 0,
      liabilityCount: 0,
      archivedCount: 0
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
    const entryStatsRecord: Record< string, EntryStats > = {};
    const yearSnapshots: Record< string, YearSnapshot > = {};

    // 1. Compute individual EntryStats
    for ( const record of entries ) {
      const { entry, history } = record;
      const historyYears = Object.keys( history ).map( Number ).sort( ( a, b ) => a - b );

      if ( historyYears.length === 0 ) {
        entryStatsRecord[ entry.id ] = {
          entryId: entry.id,
          firstYear: new Date().getFullYear(),
          lastYear: new Date().getFullYear(),
          latestValue: 0
        };

        continue;
      }

      const firstYear = historyYears[ 0 ];
      const lastYear = historyYears[ historyYears.length - 1 ];
      const firstVal = history[ `${firstYear}` ].value;
      const latestValue = history[ `${lastYear}` ].value;

      const values = Object.values( history ).map( h => h.value );
      const highestValue = Math.max( ...values );
      const lowestValue = Math.min( ...values );
      const averageValue = values.reduce( ( sum, v ) => sum + v, 0 ) / values.length;

      const absoluteGrowth = latestValue - firstVal;
      const relativeGrowth = firstVal !== 0 ? absoluteGrowth / firstVal : 0;

      let volatility = 0;
      if ( values.length > 1 ) {
        const mean = averageValue;
        const variance = values.reduce( ( sum, v ) => sum + Math.pow( v - mean, 2 ), 0 ) / ( values.length - 1 );
        volatility = Math.sqrt( variance );
      }

      let averageAnnualGrowth = 0;
      if ( historyYears.length > 1 ) {
        const yearsDiff = lastYear - firstYear;

        if ( yearsDiff > 0 && firstVal > 0 && latestValue > 0 ) {
          averageAnnualGrowth = Math.pow( latestValue / firstVal, 1 / yearsDiff ) - 1;
        }
      }

      entryStatsRecord[ entry.id ] = {
        entryId: entry.id,
        firstYear, lastYear, latestValue, highestValue, lowestValue,
        averageValue, volatility, averageAnnualGrowth,
        growth: {
          absolute: absoluteGrowth,
          relative: relativeGrowth
        }
      };
    }

    // 2. Identify all years across entries
    const allYearsSet = new Set < number > ();

    for ( const record of entries ) {
      Object.keys( record.history ).forEach( y => allYearsSet.add( Number( y ) ) );
    }

    const sortedYears = Array.from( allYearsSet ).sort( ( a, b ) => a - b );

    // 3. Compute YearSnapshots
    let prevNetWorth = 0;

    for ( const year of sortedYears ) {
      let assetsSum = 0;
      let assetsMinSum = 0;
      let assetsMaxSum = 0;

      let liabilitiesSum = 0;
      let liabilitiesMinSum = 0;
      let liabilitiesMaxSum = 0;

      const byLiquidity: Record< number, { value: number; min: number; max: number } > = {};
      const byClass: Record< string, { value: number; min: number; max: number } > = {};

      for ( const record of entries ) {
        const valObj = record.history[ `${year}` ];
        if ( ! valObj ) continue;

        const val = valObj.value;
        const minVal = valObj.min !== undefined ? valObj.min : val;
        const maxVal = valObj.max !== undefined ? valObj.max : val;

        if ( record.entry.category === 'asset' ) {
          assetsSum += val;
          assetsMinSum += minVal;
          assetsMaxSum += maxVal;
        } else {
          liabilitiesSum += val;
          liabilitiesMinSum += minVal;
          liabilitiesMaxSum += maxVal;
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
        asset: {
          value: assetsSum,
          min: assetsMinSum,
          max: assetsMaxSum,
          percentage: totalValForPercentages !== 0 ? assetsSum / totalValForPercentages : 0
        },
        liability: {
          value: liabilitiesSum,
          min: liabilitiesMinSum,
          max: liabilitiesMaxSum,
          percentage: totalValForPercentages !== 0 ? liabilitiesSum / totalValForPercentages : 0
        }
      };

      const liquidityBreakdown: Record< number, Breakdown > = {};
      Object.entries( byLiquidity ).forEach( ( [ key, item ] ) => {
        liquidityBreakdown[ Number( key ) ] = {
          value: item.value, min: item.min, max: item.max,
          percentage: assetsSum !== 0 ? item.value / assetsSum : 0
        };
      } );

      const classBreakdown: Record< string, Breakdown > = {};
      Object.entries( byClass ).forEach( ( [ key, item ] ) => {
        const entryGroup = entries.find( r => r.entry.class === key );
        const isAsset = entryGroup ? entryGroup.entry.category === 'asset' : true;
        const divisor = isAsset ? assetsSum : liabilitiesSum;

        classBreakdown[ key ] = {
          value: item.value, min: item.min, max: item.max,
          percentage: divisor !== 0 ? item.value / divisor : 0
        };
      } );

      let growthVal = undefined;
      if ( prevNetWorth !== 0 || sortedYears.indexOf( year ) > 0 ) {
        const absoluteGrowth = netWorth - prevNetWorth;
        const relativeGrowth = prevNetWorth !== 0 ? absoluteGrowth / prevNetWorth : 0;

        growthVal = {
          absolute: absoluteGrowth,
          relative: relativeGrowth
        };
      }

      yearSnapshots[ String( year ) ] = {
        year, assets: assetsSum, liabilities: liabilitiesSum,
        netWorth, minNetWorth, maxNetWorth, growth: growthVal,
        byCategory: categoryBreakdown,
        byLiquidity: liquidityBreakdown,
        byClass: classBreakdown
      };

      prevNetWorth = netWorth;
    }

    // 4. Compute PortfolioStats
    const assetCount = entries.filter( r => r.entry.category === 'asset' && ! r.entry.archived ).length;
    const liabilityCount = entries.filter( r => r.entry.category === 'liability' && ! r.entry.archived ).length;
    const archivedCount = entries.filter( r => r.entry.archived ).length;

    let firstYear = new Date().getFullYear();
    let lastYear = new Date().getFullYear();
    let latestNetWorth = 0;
    let highestNetWorth = 0;
    let lowestNetWorth = 0;
    let totalGrowth = undefined;
    let averageAnnualGrowth = 0;
    let bestYear = undefined;
    let worstYear = undefined;

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
        absolute: absoluteTotalGrowth,
        relative: relativeTotalGrowth
      };

      if ( sortedYears.length > 1 ) {
        const yearsDiff = lastYear - firstYear;

        if ( yearsDiff > 0 && firstYearNetWorth > 0 && latestNetWorth > 0 ) {
          averageAnnualGrowth = Math.pow( latestNetWorth / firstYearNetWorth, 1 / yearsDiff ) - 1;
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

    const portfolioStats: PortfolioStats = {
      firstYear, lastYear, latestNetWorth, highestNetWorth, lowestNetWorth,
      totalGrowth, averageAnnualGrowth, bestYear, worstYear, assetCount,
      liabilityCount, archivedCount
    };

    return {
      years: yearSnapshots as Record< `${number}`, YearSnapshot >,
      entries: entryStatsRecord,
      portfolio: portfolioStats
    };
  }
}

const db = new Database();
export default db;
