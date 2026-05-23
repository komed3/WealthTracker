import api from '@/src/server/api';
import db from '@/src/server/db';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname( fileURLToPath( import.meta.url ) );

async function run () : Promise< void > {
  const port = process.env.PORT || 3000;
  const app = express();

  db.initDb();

  app.use( express.json() );
  app.use( express.urlencoded( { extended: true } ) );
  app.use( '/api', api );

  if ( process.env.NODE_ENV === 'dev' ) {
    const { createServer } = await import( 'vite' );
    const vite = await createServer( { server: { middlewareMode: true } } );

    app.use( vite.middlewares );
  } else {
    const clientDist = resolve( __dirname, '../../client' );

    app.use( express.static( clientDist ) );
    app.get( '/{*splat}', ( _, res ) => { res.sendFile( join( clientDist, 'index.html' ) ) } );
  }

  app.listen( port, () => console.log( `Server startet on port ${ port }` ) );
}

run().catch( console.error );
