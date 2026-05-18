import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import type { Data, Settings } from '@/src/types/data';

const DATA_FILE_PATH = resolve( process.cwd(), 'data', 'data.json' );

const DEFAULT_DATA: Data = {
  settings: {
    display: {
      language: 'en',
      currency: 'EUR',
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

export function initDb () : void {
  const dir = dirname( DATA_FILE_PATH );

  if ( ! existsSync( dir ) ) mkdirSync( dir, { recursive: true } );

  if ( ! existsSync( DATA_FILE_PATH ) ) {
    console.log( 'Creating central data file ...' );
    writeFileSync( DATA_FILE_PATH, JSON.stringify( DEFAULT_DATA, null, 2 ), 'utf-8' );
  }
}

export function getData () : Data {
  initDb();

  const fileContent = readFileSync( DATA_FILE_PATH, 'utf-8' );
  return JSON.parse( fileContent ) as Data;
}

export function saveData ( data: Data ) : void {
  const updatedData: Data = { ...data, updatedAt: new Date().toISOString() };
  writeFileSync( DATA_FILE_PATH, JSON.stringify( updatedData, null, 2 ), 'utf-8' );
}

export function getSettings () : Settings {
  return getData().settings;
}

export function saveSettings ( settings: Settings ) : Settings {
  const data = getData();
  const updatedData: Data = { ...data, settings, updatedAt: new Date().toISOString() };

  saveData( updatedData );
  return settings;
}
