import type { Request, Response } from 'express';
import { Router } from 'express';

import { getData, getSettings, saveData, saveSettings } from '@/src/server/db';

const api = Router();

api.get( '/settings', ( _, res: Response ) => {
  try {
    res.json( getSettings() );
  } catch ( error ) {
    res.status( 500 ).json( { error: 'Failed to load settings' } );
  }
} );

api.post( '/settings', ( req: Request, res: Response ) => {
  try {
    const saved = saveSettings( req.body );
    res.json( saved );
  } catch ( error ) {
    res.status( 500 ).json( { error: 'Failed to save settings' } );
  }
} );

api.get( '/data', ( _, res: Response ) => {
  try {
    res.json( getData() );
  } catch ( error ) {
    res.status( 500 ).json( { error: 'Failed to load data' } );
  }
} );

api.post( '/data', ( req: Request, res: Response ) => {
  try {
    saveData( req.body );
    res.json( req.body );
  } catch ( error ) {
    res.status( 500 ).json( { error: 'Failed to save data' } );
  }
} );

export default api;
