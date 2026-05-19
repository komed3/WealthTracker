import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Heading } from '@/src/components/ui/Heading';
import { Icon } from '@/src/components/ui/Icon';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import type { CONFIDENCE } from '@/src/config/constants';
import { CONFIDENCE as CONFIDENCE_VALUES } from '@/src/config/constants';
import { useData } from '@/src/context/DataCtx';
import { formatCurrency } from '@/src/lib/formatter';
import i18n from '@/src/lib/i18n';
import type { YearValue } from '@/src/types/data';
import { DataPointsEditorProps } from '@/src/types/props';
import React, { useEffect, useState } from 'react';

export const DataPointsEditor = ( { entries, onUpdateHistory }: DataPointsEditorProps ) => {
  const { settings } = useData();

  const [ formYear, setFormYear ] = useState( '' );
  const [ formValue, setFormValue ] = useState( '' );
  const [ formConfidence, setFormConfidence ] = useState < CONFIDENCE > ( 'high' );
  const [ formMin, setFormMin ] = useState( '' );
  const [ formMax, setFormMax ] = useState( '' );
  const [ formSource, setFormSource ] = useState( '' );
  const [ formNote, setFormNote ] = useState( '' );
  const [ editingYear, setEditingYear ] = useState < number | null > ( null );

  const [ selectedEntryId, setSelectedEntryId ] = useState < string | null > ( () => {
    return entries.length > 0 ? entries[ 0 ].entry.id : null;
  } );

  const activeRecord = entries.find( r => r.entry.id === selectedEntryId );

  const resetFormForActive = () => {
    if ( activeRecord ) {
      const years = Object.keys( activeRecord.history ).map( Number );
      const nextYear = years.length > 0 ? Math.max( ...years ) + 1 : new Date().getFullYear();

      setFormYear( String( nextYear ) );
    } else {
      setFormYear( String( new Date().getFullYear() ) );
    }

    setFormValue( '' );
    setFormConfidence( 'high' );
    setFormMin( '' );
    setFormMax( '' );
    setFormSource( '' );
    setFormNote( '' );
    setEditingYear( null );
  };

  useEffect( () => { resetFormForActive() }, [ selectedEntryId ] );

  const handleEditClick = ( yearVal: YearValue ) => {
    setEditingYear( yearVal.year );
    setFormYear( String( yearVal.year ) );
    setFormValue( String( yearVal.value ) );
    setFormConfidence( yearVal.confidence );
    setFormMin( yearVal.min !== undefined ? String( yearVal.min ) : '' );
    setFormMax( yearVal.max !== undefined ? String( yearVal.max ) : '' );
    setFormSource( yearVal.source || '' );
    setFormNote( yearVal.note || '' );

    window.scrollTo( { top: 0, behavior: 'smooth' } );
  };

  const handleCancelEdit = () => { resetFormForActive() };

  const handleSubmit = ( e: React.SubmitEvent ) => {
    e.preventDefault();
    if ( ! activeRecord ) return;

    const parsedYear = parseInt( formYear, 10 );
    const parsedValue = parseFloat( formValue.replace( /,/g, '.' ) );

    if ( isNaN( parsedYear ) || isNaN( parsedValue ) ) return;

    if ( editingYear === null && activeRecord.history[ `${ parsedYear }` ] ) {
      alert( i18n.t( $ => $.editor.dataPointExistsAlert, { year: parsedYear } ) );
      return;
    }

    const parsedMin = formMin.trim() ? parseFloat( formMin.replace( /,/g, '.' ) ) : undefined;
    const parsedMax = formMax.trim() ? parseFloat( formMax.replace( /,/g, '.' ) ) : undefined;

    const updatedPoint: YearValue = {
      year: parsedYear, value: parsedValue, confidence: formConfidence,
      min: isNaN( parsedMin as number ) ? undefined : parsedMin,
      max: isNaN( parsedMax as number ) ? undefined : parsedMax,
      source: formSource.trim() || undefined,
      note: formNote.trim() || undefined,
      updatedAt: new Date().toISOString()
    };

    const newHistory = { ...activeRecord.history, [ `${ parsedYear }` ]: updatedPoint };
    onUpdateHistory( activeRecord.entry.id, newHistory );

    if ( editingYear !== null ) resetFormForActive();
    else {
      setFormYear( String( parsedYear + 1 ) );
      setFormValue( '' );
      setFormNote( '' );
      setFormMin( '' );
      setFormMax( '' );
      setFormSource( '' );

      setTimeout( () => {
        const inputEl = document.querySelectorAll < HTMLInputElement > ( 'input[required]' );
        if ( inputEl.length >= 2 ) inputEl[ 1 ].focus();
      }, 50 );
    }
  };

  const handleDeleteDataPoint = ( year: number ) => {
    if ( ! activeRecord ) return;
    if ( ! window.confirm( i18n.t( $ => $.editor.deleteDataPointConfirm, { year } ) ) ) return;

    const newHistory = { ...activeRecord.history };
    delete newHistory[ `${ year }` ];

    onUpdateHistory( activeRecord.entry.id, newHistory );
    if ( editingYear === year ) resetFormForActive();
  };

  const sortedHistory = activeRecord ? Object.values( activeRecord.history ).sort( ( a, b ) => b.year - a.year ) : [];

  const confidenceOptions = CONFIDENCE_VALUES.map( conf => ( {
    value: conf, label: i18n.t( $ => $.confidence[ conf ] )
  } ) );

  return (
    <div className= 'flex flex-row flex-wrap items-center gap-2 pb-8'>
      { entries.map( ( { entry } ) => (
        <button
          key= { entry.id }
          type= 'button'
          onClick= { () => setSelectedEntryId( entry.id ) }
          className= {
            `flex-none inline-flex items-center gap-3 pl-2 pr-4 py-1.5 border rounded-full transition ${
              entry.id === selectedEntryId
                ? 'bg-primary/5 border-primary'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`
          }
        >
          <div
            className= 'flex justify-center items-center shrink-0 w-8 h-8 text-white rounded-full'
            style= { { backgroundColor: entry.color } }
          >
            <Icon name= { entry.icon } size= { 14 } className= 'text-white' />
          </div>
          <span className= 'text-sm font-medium text-slate-900'>
            { entry.title }
          </span>
        </button>
      ) ) }
    </div>
  );
};
