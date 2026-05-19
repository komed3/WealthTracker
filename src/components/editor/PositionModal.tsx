import { Button } from '@/src/components/ui/Button';
import { Heading } from '@/src/components/ui/Heading';
import { Icon } from '@/src/components/ui/Icon';
import { Input } from '@/src/components/ui/Input';
import { Select } from '@/src/components/ui/Select';
import { ASSET_CLASS, CATEGORY, CLASS, COLOR, ICON, LIABILITY_CLASS, LIQUIDITY, LIQUIDITY_DEFAULT } from '@/src/config/constants';
import i18n from '@/src/lib/i18n';
import { cn } from '@/src/lib/utils';
import { PositionModalProps } from '@/src/types/props';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export const PositionModal = ( { isOpen, onClose, onSave, initialEntry }: PositionModalProps ) => {
  const [ category, setCategory ] = useState < CATEGORY > ( 'asset' );
  const [ classState, setClassState ] = useState < CLASS > ( 'bank' );
  const [ liquidity, setLiquidity ] = useState < LIQUIDITY > ( 1 );
  const [ title, setTitle ] = useState( '' );
  const [ description, setDescription ] = useState( '' );
  const [ color, setColor ] = useState < COLOR > ( COLOR[ 0 ] );
  const [ icon, setIcon ] = useState < ICON > ( ICON[ 0 ] );
  const [ archived, setArchived ] = useState( false );

  useEffect( () => {
    if ( initialEntry ) {
      setTitle( initialEntry.title );
      setDescription( initialEntry.description || '' );
      setCategory( initialEntry.category );
      setClassState( initialEntry.class );
      setLiquidity( initialEntry.liquidity );
      setColor( initialEntry.color );
      setIcon( initialEntry.icon );
      setArchived( initialEntry.archived );
    } else {
      setTitle( '' );
      setDescription( '' );
      setCategory( 'asset' );
      setClassState( 'bank' );
      setLiquidity( 1 );
      setColor( COLOR[ 0 ] );
      setIcon( ICON[ 0 ] );
      setArchived( false );
    }
  }, [ initialEntry, isOpen ] );

  const handleCategoryChange = ( newCat: CATEGORY ) => {
    setCategory( newCat );

    const defaultClass = newCat === 'asset' ? 'bank' : 'loan';
    setClassState( defaultClass );

    if ( ! initialEntry ) {
      if ( newCat === 'asset' ) setLiquidity( LIQUIDITY_DEFAULT[ 'bank' ] );
      else setLiquidity( 3 );
    }
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
      liquidity, color, icon, archived
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
    value: liq, label: `L${ liq } — ${ i18n.t( $ => $.liquidity[ liq as 1 | 2 | 3 | 4 | 5 ] ) }`
  } ) );

  return (
    <div className= 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-fade-in'>
      <div className= 'relative bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-scale-up'>
        
        { /** Header */ }
        <div className= 'flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-slate-50/50'>
          <Heading level= { 3 } className= 'font-bold text-slate-800'>
            { initialEntry ? i18n.t( $ => $.editor.editPosition ) : i18n.t( $ => $.editor.newPosition ) }
          </Heading>
          <Button
            variant= 'ghost'
            size= 'sm'
            onClick= { onClose }
            className= 'h-8 w-8 p-0 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-150'
          >
            <X size= { 18 } />
          </Button>
        </div>

        { /** Form Scroll Area */ }
        <form onSubmit= { handleSubmit } className= 'flex-1 overflow-y-auto p-6'>
          
          <div className= 'grid grid-cols-1 md:grid-cols-2 gap-8'>
            
            { /** Left Column: Details */ }
            <div className= 'space-y-4'>
              <Select
                label= { i18n.t( $ => $.editor.category ) }
                value= { category }
                options= { categoryOptions }
                onChange= { e => handleCategoryChange( e.target.value as any ) }
              />

              <Select
                label= { i18n.t( $ => $.editor.class ) }
                value= { classState }
                options= { classOptions }
                onChange= { e => handleClassChange( e.target.value ) }
              />

              <Select
                label= { i18n.t( $ => $.editor.liquidity ) }
                value= { liquidity }
                options= { liquidityOptions }
                onChange= { e => setLiquidity( Number( e.target.value ) ) }
              />

              <Input
                label= { i18n.t( $ => $.editor.positionTitle ) }
                placeholder= { i18n.t( $ => $.editor.positionTitlePlaceholder ) }
                value= { title }
                onChange= { e => setTitle( e.target.value ) }
                required
              />

              <div className= 'flex flex-col gap-2 w-full'>
                <label className= 'text-sm font-medium text-slate-600'>
                  { i18n.t( $ => $.editor.descriptionLabel ) }
                </label>
                <textarea
                  placeholder= { i18n.t( $ => $.editor.descriptionPlaceholder ) }
                  value= { description }
                  onChange= { e => setDescription( e.target.value ) }
                  rows= { 3 }
                  className= 'w-full px-4 py-2.5 text-slate-800 placeholder:text-slate-400 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200 text-md font-sans'
                />
              </div>

              { /** Archived Toggle */ }
              { initialEntry && (
                <div className= 'flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200'>
                  <div className= 'flex flex-col gap-0.5'>
                    <span className= 'text-sm font-semibold text-slate-700'>{ i18n.t( $ => $.editor.archivePosition ) }</span>
                    <span className= 'text-xs text-slate-400'>{ i18n.t( $ => $.editor.archiveDescription ) }</span>
                  </div>
                  <label className= 'relative inline-flex items-center cursor-pointer'>
                    <input
                      type= 'checkbox'
                      checked= { archived }
                      onChange= { e => setArchived( e.target.checked ) }
                      className= 'sr-only peer'
                    />
                    <div className= "w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              ) }
            </div>

            { /** Right Column: Styles */ }
            <div className= 'space-y-6'>
              { /** Color Chooser */ }
              <div className= 'space-y-2.5'>
                <label className= 'text-sm font-medium text-slate-600'>
                  { i18n.t( $ => $.editor.color ) }
                </label>
                <div className= 'grid grid-cols-6 gap-2'>
                  { COLOR.map( col => {
                    const isSelected = color === col;
                    return (
                      <button
                        key= { col }
                        type= 'button'
                        onClick= { () => setColor( col ) }
                        className= 'relative w-8 h-8 rounded-full border border-black/5 hover:scale-105 active:scale-95 transition-all shadow-xs flex items-center justify-center text-white cursor-pointer'
                        style= { { backgroundColor: col } }
                      >
                        { isSelected && <Check size= { 14 } strokeWidth= { 3 } /> }
                      </button>
                    );
                  } ) }
                </div>
              </div>

              { /** Icon Chooser */ }
              <div className= 'space-y-2.5'>
                <label className= 'text-sm font-medium text-slate-600'>
                  { i18n.t( $ => $.editor.icon ) }
                </label>

                <div className= 'flex flex-wrap gap-2'>
                  { ICON.map( name => {
                    const isSelected = icon === name;
                    return (
                      <button
                        key= { name }
                        type= 'button'
                        onClick= { () => setIcon( name ) }
                        title= { name }
                        className= { cn(
                          'flex items-center justify-center rounded-lg transition-all hover:bg-white hover:scale-105 active:scale-95 border border-transparent shadow-xs cursor-pointer w-10 h-10 aspect-square',
                          isSelected 
                            ? 'bg-primary text-white hover:bg-primary shadow-md border-primary/20 scale-105' 
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
          <div className= 'flex justify-end gap-3 pt-6 border-t border-slate-100 mt-6 shrink-0'>
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
