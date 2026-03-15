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
}

startServer();
