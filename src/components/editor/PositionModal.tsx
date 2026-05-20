import { Button } from '@/src/components/ui/Button';
import { Heading } from '@/src/components/ui/Heading';
import { Icon } from '@/src/components/ui/Icon';
import { Input, Textarea } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { Toggle } from '@/src/components/ui/Toggle';
import { ASSET_CLASS, CATEGORY, CLASS, COLOR, ICON, LIABILITY_CLASS, LIQUIDITY, LIQUIDITY_DEFAULT } from '@/src/config/constants';
import i18n from '@/src/lib/i18n';
import { cn } from '@/src/lib/utils';
import { PositionModalProps } from '@/src/types/props';
import { Check, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const PositionModal = ( { isOpen, onClose, onSave, initialEntry }: PositionModalProps ) => {
  const [ category, setCategory ] = useState < CATEGORY > ( 'asset' );
  const [ classState, setClassState ] = useState < CLASS > ( 'bank' );
  const [ liquidity, setLiquidity ] = useState < LIQUIDITY > ( 1 );
  const [ title, setTitle ] = useState( '' );
  const [ description, setDescription ] = useState( '' );
  const [ color, setColor ] = useState < COLOR > ( COLOR[ 0 ] );
  const [ icon, setIcon ] = useState < ICON > ( ICON[ 0 ] );
  const [ archived, setArchived ] = useState( false );
  const [ notional, setNotional ] = useState( false );

  useEffect( () => {
    if ( initialEntry ) {
      setTitle( initialEntry.title );
      setDescription( initialEntry.description || '' );
      setCategory( initialEntry.category );
      setClassState( initialEntry.class );
      setLiquidity( initialEntry.liquidity );
      setArchived( initialEntry.archived );
      setNotional( initialEntry.notional );
      setColor( initialEntry.color );
      setIcon( initialEntry.icon );
    } else {
      setTitle( '' );
      setDescription( '' );
      setCategory( 'asset' );
      setClassState( 'bank' );
      setLiquidity( 1 );
      setArchived( false );
      setNotional( false );
      setColor( COLOR[ 0 ] );
      setIcon( ICON[ 0 ] );
    }
  }, [ initialEntry, isOpen ] );

  const handleCategoryChange = ( newCat: CATEGORY ) => {
    const defaultClass = newCat === 'asset' ? 'bank' : 'loan';
    setCategory( newCat );
    setClassState( defaultClass );

    if ( ! initialEntry ) setLiquidity( newCat === 'asset' ? LIQUIDITY_DEFAULT[ 'bank' ] : 3 );
  };

  const handleClassChange = ( newClass: CLASS ) => {
    setClassState( newClass );

    if ( ! initialEntry ) {
      if ( category === 'asset' && newClass in LIQUIDITY_DEFAULT ) setLiquidity(
        LIQUIDITY_DEFAULT[ newClass as keyof typeof LIQUIDITY_DEFAULT ]
      );

      else if ( category === 'liability' ) setLiquidity( 3 );
    }
  };

  const handleSubmit = ( e: React.SubmitEvent ) => {
    e.preventDefault();
    if ( ! title.trim() ) return;

    onSave( {
      id: initialEntry?.id,
      title: title.trim(),
      description: description.trim() || undefined,
      category, class: classState,
      liquidity, archived, notional,
      color, icon
    } );
  };

  if ( ! isOpen ) return null;

  const categoryOptions = CATEGORY.map( cat => ( {
    value: cat, label: i18n.t( $ => $.category[ cat ] )
  } ) );

  const classOptions = ( category === 'asset' ? ASSET_CLASS : LIABILITY_CLASS ).map( cls => {
    const label = category === 'asset'
      ? i18n.t( $ => $.assetClass[ cls as keyof typeof $.assetClass ] || cls )
      : i18n.t( $ => $.liabilityClass[ cls as keyof typeof $.liabilityClass ] || cls );
    return { value: cls, label };
  } );

  const liquidityOptions = LIQUIDITY.map( liq => ( {
    value: liq, label: `${ i18n.t( $ => $.liquidity[ liq as 1 | 2 | 3 | 4 | 5 ] ) }`
  } ) );

  return (
    <div className= 'fixed inset-0 z-50 flex justify-center items-center p-4 bg-slate-300/40 backdrop-blur-xs animate-fade-in'>
      <div className= 'relative flex flex-col w-full max-w-5xl max-h-[90vh] bg-white rounded-xl shadow-3xl overflow-hidden animate-scale-up'>
        { /** Header */ }
        <div className= 'flex justify-between items-center shrink-0 px-6 py-2 border-b border-slate-200 bg-slate-50/50'>
          <Heading level= { 3 }>
            { initialEntry ? i18n.t( $ => $.editor.editPosition ) : i18n.t( $ => $.editor.newPosition ) }
          </Heading>
          <Button
            variant= 'ghost'
            onClick= { onClose }
            className= 'w-12 h-12 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-150 rounded'
          >
            <X size= { 22 } />
          </Button>
        </div>

        { /** Form Scroll Area */ }
        <form onSubmit= { handleSubmit } className= 'flex-1 p-6 overflow-y-auto'>
          <div className= 'grid grid-cols-1 md:grid-cols-2 gap-12'>

            { /** Left Column: Details */ }
            <div className= 'space-y-4'>
              <Input
                label= { i18n.t( $ => $.editor.positionTitle ) }
                placeholder= { i18n.t( $ => $.editor.positionTitlePlaceholder ) }
                value= { title }
                onChange= { e => setTitle( e.target.value ) }
                required
              />

              <Select
                label= { i18n.t( $ => $.editor.category ) }
                value= { category }
                options= { categoryOptions }
                onChange= { e => handleCategoryChange( e.target.value as CATEGORY ) }
              />

              <Select
                label= { i18n.t( $ => $.editor.class ) }
                value= { classState }
                options= { classOptions }
                onChange= { e => handleClassChange( e.target.value as CLASS ) }
              />

              <Select
                label= { i18n.t( $ => $.editor.liquidity ) }
                value= { liquidity }
                options= { liquidityOptions }
                onChange= { e => setLiquidity( Number( e.target.value ) as LIQUIDITY ) }
              />

              <Textarea
                label= { i18n.t( $ => $.editor.descriptionLabel ) }
                placeholder= { i18n.t( $ => $.editor.descriptionPlaceholder ) }
                value= { description }
                onChange= { e => setDescription( e.target.value ) }
                rows= { 3 }
                className= 'mt-0'
              />

              <Toggle
                label= { i18n.t( $ => $.editor.notionalPosition ) }
                checked= { notional }
                onChange= { setNotional }
              />

              <Toggle
                label= { i18n.t( $ => $.editor.archivePosition ) }
                checked= { archived }
                onChange= { setArchived }
              />
            </div>

            { /** Right Column: Styles */ }
            <div className= 'space-y-6'>
              { /** Color Chooser */ }
              <div className= 'relative flex flex-col gap-2 w-full'>
                <label className= 'font-medium text-sm text-slate-600'>
                  { i18n.t( $ => $.editor.color ) }
                </label>
                <div className= 'grid grid-cols-[repeat(auto-fit,2rem)] gap-3'>
                  { COLOR.map( col => (
                    <button
                      key= { col }
                      type= 'button'
                      onClick= { () => setColor( col ) }
                      className= {
                        'relative flex justify-center items-center w-8 h-8 text-white border border-black/5 ' +
                        'rounded-full hover:scale-105 active:scale-95 transition-all'
                      }
                      style= { { backgroundColor: col } }
                    >
                      { color === col && <Check size= { 14 } strokeWidth= { 3 } /> }
                    </button>
                  ) ) }
                </div>
              </div>

              { /** Icon Chooser */ }
              <div className= 'relative flex flex-col gap-2 w-full'>
                <label className= 'font-medium text-sm text-slate-600'>
                  { i18n.t( $ => $.editor.icon ) }
                </label>
                <div className= 'grid grid-cols-[repeat(auto-fit,3rem)] gap-1.5'>
                  { ICON.map( name => {
                    const isSelected = icon === name;
                    return (
                      <button
                        key= { name }
                        type= 'button'
                        onClick= { () => setIcon( name ) }
                        title= { name }
                        className= { cn(
                          'aspect-square flex justify-center items-center w-12 h-12 hover:bg-white border',
                          'border-slate-100 hover:scale-105 active:scale-95 rounded-lg transition-all',
                          isSelected
                            ? 'text-white bg-primary hover:bg-primary border-primary/20 scale-105'
                            : 'text-slate-500 hover:text-slate-800 hover:border-slate-200'
                        ) }
                      >
                        <Icon name= { name } size= { 18 } />
                      </button>
                    );
                  } ) }
                </div>
              </div>
            </div>
          </div>

          { /** Footer buttons */ }
          <div className= 'flex justify-end gap-3 shrink-0 mt-6 pt-6 border-t border-slate-200'>
            <Button
              type= 'button'
              variant= 'ghost'
              onClick= { onClose }
            >
              { i18n.t( $ => $.editor.cancel ) }
            </Button>
            <Button
              type= 'submit'
              variant= 'primary'
              disabled= { ! title.trim() }
            >
              { i18n.t( $ => $.editor.save ) }
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
