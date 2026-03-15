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
}

startServer();
