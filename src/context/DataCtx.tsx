import i18n from '@/src/lib/i18n';
import type { DataCtxType } from '@/src/types/context';
import type { Data, EntryRecord, Settings } from '@/src/types/data';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

const DataCtx = createContext < DataCtxType | undefined > ( undefined );

export const DataProvider = ( { children }: { children: ReactNode } ) => {
  const [ data, setData ] = useState < Data | null > ( null );
  const [ loading, setLoading ] = useState( true );

  const refreshData = async () => {
    try {
      const res = await fetch( '/api/data' );

      if ( res.ok ) {
        const json = await res.json() as Data;
        if ( json.settings?.display?.language ) await i18n.changeLanguage( json.settings.display.language );
        setData( json );
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
        if ( savedSettings.display?.language ) await i18n.changeLanguage( savedSettings.display.language );
        setData( prev => prev ? { ...prev, settings: savedSettings } : null );

        return true;
      }

      return false;
    } catch ( err ) {
      console.error( 'Error updating settings:', err );
      return false;
    }
  };

  const updateEntries = async ( newEntries: EntryRecord[] ) => {
    if ( ! data ) return false;
    try {
      const updatedData = { ...data, entries: newEntries };
      const res = await fetch( '/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( updatedData )
      } );

      if ( res.ok ) {
        const savedData = await res.json() as Data;
        setData( savedData );

        return true;
      }

      return false;
    } catch ( err ) {
      console.error( 'Error updating entries:', err );
      return false;
    }
  };

  useEffect( () => { refreshData() }, [] );

  const value: DataCtxType = {
    loading, data, settings: data ? data.settings : null,
    updateSettings, updateEntries, refreshData
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
