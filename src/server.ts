import fs from 'node:fs/promises';
import { join } from 'node:path';

import express from 'express';
import { createServer, loadEnv } from 'vite';

import { INFLATION_RATES } from './constants/inflation.js';

async function startServer () : Promise< void > {
    const app = express();
    const { PORT } = loadEnv( process.env.NODE_ENV || 'development', process.cwd() );
    const DB_PATH = join( process.cwd(), 'data/db.json' );

    app.use( express.json() );
    app.use( express.urlencoded( { extended: true } ) );

    // API Routes
    app.get( '/api/data', async ( _, res ) => {
        try {
            const raw = await fs.readFile( DB_PATH, 'utf-8' );
            res.json( JSON.parse( raw ) );
        } catch ( error ) {
            res.status( 500 ).json( { error: 'Failed to read database' } );
        }
    } );

    app.post( '/api/data', async ( req, res ) => {
        try {
            const data = req.body;

            // Calculate Statistics
            const years = new Set< string >();
            data.categories.forEach( ( cat: any ) => {
                Object.keys( cat.values ).forEach( y => years.add( y ) );
            } );

            const sortedYears = Array.from( years ).sort();
            const yearlyStats: Record< string, any > = {};

            sortedYears.forEach( ( year, index ) => {
                const stats: any = { year, total: 0, byRubric: {}, categoryShares: {}, growthRate: 0 };

                data.categories.forEach( ( cat: any ) => {
                    const val = cat.values[ year ] || 0;
                    stats.total += val;
                    stats.byRubric[ cat.rubric ] = ( stats.byRubric[ cat.rubric ] || 0 ) + val;
                } );

                if ( stats.total > 0 ) data.categories.forEach( ( cat: any ) => {
                    const val = cat.values[ year ] || 0;
                    stats.categoryShares[ cat.id ] = ( val / stats.total ) * 100;
                } );

                if ( index > 0 ) {
                    const prevYear = sortedYears[ index - 1 ];
                    const prevTotal = yearlyStats[ prevYear ].total;

                    if ( prevTotal !== 0 ) stats.growthRate = ( ( stats.total - prevTotal ) / prevTotal ) * 100;
                }

                // Calculate Forward Inflation
                const latestYear = sortedYears[ sortedYears.length - 1 ];
                let inflationValue = stats.total;

                if ( year !== latestYear ) {
                    let multiplier = 1;
                    const startIndex = sortedYears.indexOf( year ) + 1;
                    const endIndex = sortedYears.indexOf( latestYear );

                    for ( let i = startIndex; i <= endIndex; i++ ) {
                        const y = sortedYears[ i ];
                        const rate = ( INFLATION_RATES[ y ] || 2.0 ) / 100;
                        multiplier *= ( 1 + rate );
                    }

                    inflationValue = stats.total * multiplier;
                }

                stats.inflationValue = inflationValue;
                let stabilityScore = 0;

                // Calculate Stability
                const weights: Record< string, number > = {
                    liquid: 1.0, funds: 0.8, bound: 0.4, tangibles: 0.6,
                    liabilities: 0.0, pension: 0.7
                };

                if ( stats.total > 0 ) Object.entries( stats.byRubric ).forEach( ( [ rubric, value ] ) => {
                    const weight = weights[ rubric ] || 0.5;
                    stabilityScore += ( ( value as number ) / stats.total ) * weight;
                } );

                stats.stability = Math.round( stabilityScore * 100 );

                yearlyStats[ year ] = stats;
            } );

            data.stats = { yearly: yearlyStats };

            await fs.writeFile( DB_PATH, JSON.stringify( data, null, 2 ) );
            res.json( { success: true } );
        } catch ( error ) {
            console.error( error );
            res.status( 500 ).json( { error: 'Failed to write database' } );
        }
    } );
}

startServer();
