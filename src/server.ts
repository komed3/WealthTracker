import express from 'express';

async function run () : Promise< void > {
  const app = express();
  const port = process.env.PORT || 3000;
  
  app.use( express.json() );
  app.use( express.urlencoded( { extended: true } ) );
  
  app.listen( port, () => console.log( `Server startet on ::${ port }` ) );
}

run().catch( console.error );
