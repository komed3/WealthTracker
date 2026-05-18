import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import i18n from '@/src/lib/i18n';
import type { DataCtxType } from '@/src/types/context';
import type { Data, Settings } from '@/src/types/data';

const DataCtx = createContext < DataCtxType | undefined > ( undefined );

export const DataProvider = ( { children }: { children: ReactNode } ) => {
  const [ data, setData ] = useState < Data | null > ( null );
  const [ loading, setLoading ] = useState( true );

  const refreshData = async () => {
    try {
      const res = await fetch( '/api/data' );

      if ( res.ok ) {
        const json = await res.json() as Data;
        setData( json );

        if ( json.settings?.display?.language ) {
          await i18n.changeLanguage( json.settings.display.language );
        }
      }
    } catch ( err ) {
      console.error( 'Error fetching data:', err );
    } finally {
      setLoading( false );
    }
  };

  const updateSettings = async ( settings: Settings ) => {
    try {
      const res = await fetch( '/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( settings )
      } );

      if ( res.ok ) {
        const savedSettings = await res.json() as Settings;
        setData( prev => prev ? { ...prev, settings: savedSettings } : null );

        if ( savedSettings.display?.language ) {
          await i18n.changeLanguage( savedSettings.display.language );
        }

        return true;
      }

      return false;
    } catch ( err ) {
      console.error( 'Error updating settings:', err );
      return false;
    }
  };

  useEffect( () => { refreshData() }, [] );

  const value: DataCtxType = {
    loading, data, settings: data ? data.settings : null,
    updateSettings, refreshData
  };

  return (
    <DataCtx.Provider value= { value }>
      { children }
    </DataCtx.Provider>
  );
};

export const useData = () : DataCtxType => {
  const context = useContext( DataCtx );
  if ( context === undefined ) throw new Error( 'useData must be used within a DataProvider' );
  return context;
};
