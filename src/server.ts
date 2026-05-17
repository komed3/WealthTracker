import express from 'express';
import { createServer } from 'vite';

async function run () : Promise< void > {
  const app = express();
  const port = process.env.PORT || 3000;

  const vite = await createServer( {
    server: { middlewareMode: true }
  } );

  app.use( express.json() );
  app.use( express.urlencoded( { extended: true } ) );
  app.use( vite.middlewares );

  app.listen( port, () => console.log( `Server startet on ::${ port }` ) );
}

run().catch( console.error );
