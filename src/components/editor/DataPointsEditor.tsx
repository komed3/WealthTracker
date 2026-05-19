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
    <div className= 'w-full animate-fade-in'>
      <div className= 'flex flex-col gap-2'>
        <div className= 'w-full'>
          <div className= 'flex flex-row flex-wrap items-center gap-2 pb-8'>
            { entries.map( ( { entry } ) => {
              const isSelected = entry.id === selectedEntryId;

              return (
                <button
                  key= { entry.id }
                  type= 'button'
                  onClick= { () => setSelectedEntryId( entry.id ) }
                  className= { `inline-flex items-center gap-2 rounded-full pl-2 pr-4 py-1.5 transition flex-none border ${ isSelected ? 'bg-primary/5 border-primary' : 'bg-white border-slate-200 hover:bg-slate-50' }` }
                >
                  <div className= 'flex items-center justify-center w-8 h-8 rounded-full text-white shrink-0' style= { { backgroundColor: entry.color } }>
                    <Icon name= { entry.icon } size= { 14 } className= 'text-white' />
                  </div>

                  <span className= 'text-sm font-medium text-slate-900 truncate'>
                    { entry.title }
                  </span>
                </button>
              );
            } ) }
          </div>
        </div>

        <div className= 'flex-1 space-y-6'>
          { activeRecord ? (
            <>
              { /** Card 2: Entry Form */ }
              <form onSubmit= { handleSubmit }>
                <Card className= 'space-y-4'>
                  <Heading level= { 3 }>
                    { editingYear !== null ? i18n.t( $ => $.editor.editDataPoint ) : i18n.t( $ => $.editor.addDataPoint ) }
                  </Heading>

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

              <div className= 'grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-200 pt-6'>
                <Input
                  label= { i18n.t( $ => $.editor.minimum ) }
                  type= 'text'
                  placeholder= { i18n.t( $ => $.editor.minPlaceholder ) }
                  value= { formMin }
                  onChange= { e => setFormMin( e.target.value ) }
                  isCurrency
                />

                <Input
                  label= { i18n.t( $ => $.editor.maximum ) }
                  type= 'text'
                  placeholder= { i18n.t( $ => $.editor.maxPlaceholder ) }
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
                <Button type= 'submit' variant= 'primary'>
                  { editingYear !== null ? i18n.t( $ => $.editor.save ) : i18n.t( $ => $.editor.add ) }
                </Button>
              </div>
            </Card>
          </form>

          { /** Card 3: History List */ }
          <div className= 'w-full bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col animate-fade-in shadow-sm'>
            <div className= 'overflow-x-auto w-full'>
              <table className= 'w-full min-w-225 border-collapse text-left text-sm text-slate-800'>
                <thead>
                  <tr className= 'border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-550 uppercase tracking-wider'>
                    <th className= 'py-4 px-6 whitespace-nowrap w-24'>{ i18n.t( $ => $.editor.year ) }</th>
                    <th className= 'py-4 px-6 whitespace-nowrap text-right w-36'>{ i18n.t( $ => $.editor.value ) }</th>
                    <th className= 'py-4 px-6 whitespace-nowrap w-32'>{ i18n.t( $ => $.editor.confidence ) }</th>
                    <th className= 'py-4 px-6 whitespace-nowrap text-right w-32'>{ i18n.t( $ => $.editor.minHeader ) }</th>
                    <th className= 'py-4 px-6 whitespace-nowrap text-right w-32'>{ i18n.t( $ => $.editor.maxHeader ) }</th>
                    <th className= 'py-4 px-6 whitespace-nowrap text-right w-48'>{ i18n.t( $ => $.editor.actionsHeader ) }</th>
                  </tr>
                </thead>
                <tbody className= 'divide-y divide-slate-200'>
                  { sortedHistory.map( yearVal => {
                    return (
                      <tr key= { yearVal.year } className= 'align-middle'>
                        { /** Year */ }
                        <td className= 'py-4 px-6 whitespace-nowrap font-semibold'>
                          { yearVal.year }
                        </td>

                        { /** Value */ }
                        <td className= 'py-4 px-6 whitespace-nowrap text-right'>
                          { formatCurrency( yearVal.value, settings?.display ) }
                        </td>

                        { /** Confidence */ }
                        <td className= 'py-4 px-6 whitespace-nowrap'>
                          { i18n.t( $ => $.confidence[ yearVal.confidence ] ) }
                        </td>

                        { /** Min / Max */ }
                        <td className= 'py-4 px-6 whitespace-nowrap'>
                          { yearVal.min && (
                            <span>
                              { formatCurrency( yearVal.min, settings?.display ) }
                            </span>
                          ) }
                        </td>
                        <td className= 'py-4 px-6 whitespace-nowrap'>
                          { yearVal.max && (
                            <span>
                              { formatCurrency( yearVal.max, settings?.display ) }
                            </span>
                          ) }
                        </td>

                        { /** Actions */ }
                        <td className= 'py-4 px-6 whitespace-nowrap text-right'>
                          <div className= 'flex items-center justify-end gap-3'>
                            <Button
                              variant= 'secondary'
                              onClick= { () => handleEditClick( yearVal ) }
                            >
                              { i18n.t( $ => $.editor.editButton ) }
                            </Button>
                            <Button
                              variant= 'secondary'
                              onClick= { () => handleDeleteDataPoint( yearVal.year ) }
                            >
                              { i18n.t( $ => $.editor.deleteButton ) }
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  } ) }

                  { sortedHistory.length === 0 && (
                    <tr>
                      <td colSpan= { 7 } className= 'py-12 text-center text-slate-500 font-medium'>
                        { i18n.t( $ => $.editor.noDataPoints ) }
                      </td>
                    </tr>
                  ) }
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <Card className= 'flex flex-col items-center justify-center p-12 text-center min-h-[30vh] w-full'>
          <h3 className= 'font-semibold text-slate-800 text-sm mb-1'>
            { i18n.t( $ => $.editor.noPositionSelected ) }
          </h3>
          <p className= 'text-xs text-slate-500 max-w-sm'>
            { i18n.t( $ => $.editor.selectPositionDesc ) }
          </p>
        </Card>
      ) }
      </div>
    </div>
  </div>
  );
};
