import express from 'express';
import { createServer } from 'vite';

import api from '@/src/server/api';
import { initDb } from '@/src/server/db';

async function run () : Promise< void > {
  const port = process.env.PORT || 3000;
  const app = express();

  initDb();

  const vite = await createServer( {
    server: { middlewareMode: true }
  } );

  app.use( express.json() );
  app.use( express.urlencoded( { extended: true } ) );
  app.use( '/api', api );
  app.use( vite.middlewares );

  app.listen( port, () => console.log( `Server startet on port ${ port }` ) );
}

run().catch( console.error );
