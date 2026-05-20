import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
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

export const DataPointsEditor = ( { entries, onUpdateHistory, setActiveTab }: DataPointsEditorProps ) => {
  if ( entries.length === 0 ) setActiveTab( 'entries' );

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
    const years = activeRecord ? Object.keys( activeRecord.history ).map( Number ) : [];
    setFormYear( String( years.length > 0 ? Math.max( ...years ) + 1 : new Date().getFullYear() ) );

    setFormValue( '' );
    setFormConfidence( 'high' );
    setFormMin( '' );
    setFormMax( '' );
    setFormSource( '' );
    setFormNote( '' );

    setEditingYear( null );
  };

  useEffect( () => { resetFormForActive() }, [ selectedEntryId ] );
  const handleCancelEdit = () => { resetFormForActive() };

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

    onUpdateHistory( activeRecord.entry.id, {
      ...activeRecord.history,
      [ `${ parsedYear }` ]: {
        year: parsedYear, value: parsedValue, confidence: formConfidence,
        min: isNaN( parsedMin as number ) ? undefined : parsedMin,
        max: isNaN( parsedMax as number ) ? undefined : parsedMax,
        source: formSource.trim() || undefined, note: formNote.trim() || undefined,
        updatedAt: new Date().toISOString()
      }
    } );

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
    <div className= 'space-y-8'>
      { /** Asset Selector */ }
      <div className= 'flex flex-row flex-wrap items-center gap-2'>
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

      { /** Annual Data Editor */ }
      <div className= 'flex-1 space-y-6'>
        { activeRecord && (
          <>
            { /** Card 2: Entry Form */ }
            <form onSubmit= { handleSubmit }>
              <Card className= 'space-y-4'>
                <div className= 'grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <Input
                    label= { i18n.t( $ => $.editor.year ) }
                    type= 'number'
                    placeholder= { i18n.t( $ => $.editor.yearPlaceholder ) }
                    value= { formYear }
                    onChange= { e => setFormYear( e.target.value ) }
                    disabled= { editingYear !== null }
                    required
                  />

                  <Input
                    label= { i18n.t( $ => $.editor.value ) }
                    type= 'text'
                    placeholder= { i18n.t( $ => $.editor.valuePlaceholder ) }
                    value= { formValue }
                    onChange= { e => setFormValue( e.target.value ) }
                    isCurrency
                    required
                  />

                  <Select
                    label= { i18n.t( $ => $.editor.confidence ) }
                    value= { formConfidence }
                    options= { confidenceOptions }
                    onChange= { e => setFormConfidence( e.target.value as CONFIDENCE ) }
                  />
                </div>

                <div className= 'grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <Input
                    label= { i18n.t( $ => $.editor.minimum ) }
                    type= 'text'
                    placeholder= { i18n.t( $ => $.editor.valuePlaceholder ) }
                    value= { formMin }
                    onChange= { e => setFormMin( e.target.value ) }
                    isCurrency
                  />

                  <Input
                    label= { i18n.t( $ => $.editor.maximum ) }
                    type= 'text'
                    placeholder= { i18n.t( $ => $.editor.valuePlaceholder ) }
                    value= { formMax }
                    onChange= { e => setFormMax( e.target.value ) }
                    isCurrency
                  />

                  <Input
                    label= { i18n.t( $ => $.editor.source ) }
                    type= 'text'
                    placeholder= { i18n.t( $ => $.editor.sourcePlaceholder ) }
                    value= { formSource }
                    onChange= { e => setFormSource( e.target.value ) }
                  />
                </div>

                <div>
                  <Input
                    label= { i18n.t( $ => $.editor.note ) }
                    type= 'text'
                    placeholder= { i18n.t( $ => $.editor.notePlaceholder ) }
                    value= { formNote }
                    onChange= { e => setFormNote( e.target.value ) }
                  />
                </div>

                <div className= 'flex justify-end items-center gap-4'>
                  { editingYear !== null && (
                    <Button
                      type= 'button'
                      variant= 'secondary'
                      onClick= { handleCancelEdit }
                    >
                      { i18n.t( $ => $.editor.cancel ) }
                    </Button>
                  ) }
                  <Button
                    type= 'submit'
                    variant= 'primary'
                  >
                    { editingYear !== null ? i18n.t( $ => $.editor.save ) : i18n.t( $ => $.editor.add ) }
                  </Button>
                </div>
              </Card>
            </form>
          </>
        ) }
      </div>

      { /** History */ }
      <div className= 'flex flex-col w-full bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden'>
        <div className= 'w-full whitespace-nowrap overflow-x-auto'>
          <table className= 'w-full text-left text-sm text-slate-800 border-collapse'>
            <thead>
              <tr className= 'uppercase font-semibold text-xs text-slate-550 tracking-wider bg-slate-50 border-b border-slate-200'>
                <th className= 'px-6 py-4'>{ i18n.t( $ => $.editor.year ) }</th>
                <th className= 'px-6 py-4 text-right'>{ i18n.t( $ => $.editor.value ) }</th>
                <th className= 'px-6 py-4 text-right'>{ i18n.t( $ => $.editor.minimum ) }</th>
                <th className= 'px-6 py-4 text-right'>{ i18n.t( $ => $.editor.maximum ) }</th>
                <th className= 'px-6 py-4'>{ i18n.t( $ => $.editor.confidence ) }</th>
                <th className= 'px-6 py-4 text-right'>{ i18n.t( $ => $.editor.actions ) }</th>
              </tr>
            </thead>
            <tbody className= 'divide-y divide-dashed divide-slate-200'>
              { sortedHistory.map( yearVal => (
                <tr key= { yearVal.year } className= 'h-16 align-middle'>
                  { /** Year */ }
                  <td className= 'px-6 py-4 font-semibold'>
                    { yearVal.year }
                  </td>

                  { /** Value */ }
                  <td className= 'px-6 py-4 text-right font-mono text-lg font-semibold text-primary'>
                    { formatCurrency( yearVal.value, settings?.display ) }
                  </td>

                  { /** Min / Max */ }
                  <td className= 'px-6 py-4 text-right font-mono'>
                    { yearVal.min ? (
                      <span>
                        { formatCurrency( yearVal.min, settings?.display ) }
                      </span>
                    ) : '—' }
                  </td>
                  <td className= 'px-6 py-4 text-right font-mono'>
                    { yearVal.max ? (
                      <span>
                        { formatCurrency( yearVal.max, settings?.display ) }
                      </span>
                    ) : '—' }
                  </td>

                  { /** Confidence */ }
                  <td className= 'px-6 py-4'>
                    { i18n.t( $ => $.confidence[ yearVal.confidence ] ) }
                  </td>

                  { /** Actions */ }
                  <td className= 'px-6 py-2 text-right'>
                    <div className= 'flex justify-end items-center gap-3'>
                      <Button
                        variant= 'secondary'
                        onClick= { () => handleEditClick( yearVal ) }
                        className= 'h-10 px-4 text-sm'
                      >
                        { i18n.t( $ => $.editor.editButton ) }
                      </Button>
                      <Button
                        variant= 'secondary'
                        onClick= { () => handleDeleteDataPoint( yearVal.year ) }
                        className= 'h-10 px-4 text-sm'
                      >
                        { i18n.t( $ => $.editor.deleteButton ) }
                      </Button>
                    </div>
                  </td>
                </tr>
              ) ) }

              { sortedHistory.length === 0 && (
                <tr>
                  <td colSpan= { 6 } className= 'py-12 text-center font-medium text-slate-400'>
                    { i18n.t( $ => $.editor.noDataPoints ) }
                  </td>
                </tr>
              ) }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
