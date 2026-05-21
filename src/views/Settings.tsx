import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Heading } from '@/src/components/ui/Heading';
import { Input } from '@/src/components/ui/Input';
import { Intro } from '@/src/components/ui/Intro';
import { Select } from '@/src/components/ui/Select';
import { CURRENCY, GENDER } from '@/src/config/constants';
import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import i18n from '@/src/lib/i18n';
import type { Settings as SettingsType } from '@/src/types/data';
import React, { useEffect, useState } from 'react';

export const Settings = () => {
  const { settings, updateSettings, loading } = useData();
  const { setTitle, setLoading } = useLayout();
  const [ formState, setFormState ] = useState < SettingsType | null > ( null );
  const [ success, setSuccess ] = useState( false );

  useEffect( () => { setTitle( i18n.t( $ => $.settings.title ) ) }, [ setTitle, settings?.display.language ] );
  useEffect( () => { if ( settings ) { setFormState( settings ) } }, [ settings ] );
  useEffect( () => { setLoading( loading ) }, [ loading, setLoading ] );

  if ( ! formState ) return null;

  const handleDisplayChange = ( key: keyof SettingsType[ 'display' ], value: string | number ) => {
    setFormState( prev => {
      if ( ! prev ) return null;
      return { ...prev, display: { ...prev.display, [ key ]: value } };
    } );
  };

  const handleProfileChange = ( key: keyof SettingsType[ 'profile' ], value: string ) => {
    setFormState( prev => {
      if ( ! prev ) return null;
      return { ...prev, profile: { ...prev.profile, [ key ]: value } };
    } );
  };

  const handleSubmit = async ( e: React.SubmitEvent ) => {
    e.preventDefault();

    setLoading( true );
    setSuccess( false );
    const ok = await updateSettings( formState );
    setLoading( false );

    if ( ok ) {
      setSuccess( true );
      setTimeout( () => setSuccess( false ), 3000 );
    }
  };

  const languageOptions = [ 'de', 'en' ].map( lang => ( {
    value: lang, label: i18n.t( $ => $.languages[ lang as 'de' | 'en' ] )
  } ) );

  const currencyOptions = CURRENCY.map( cur => ( {
    value: cur, label: i18n.t( $ => $.currencies[ cur ] )
  } ) );

  const decimalOptions = [ 0, 1, 2, 3, 4 ].map( dec => ( {
    value: dec, label: String( dec )
  } ) );

  const genderOptions = GENDER.map( gen => ( {
    value: gen, label: i18n.t( $ => $.genders[ gen ] )
  } ) );

  return (
    <div className= 'flex-1 space-y-8 w-full max-w-4xl mx-auto'>
      <Intro
        title= { i18n.t( $ => $.settings.title ) }
        description= { i18n.t( $ => $.settings.description ) }
      />

      <form onSubmit= { handleSubmit } className= 'space-y-6'>
        <Card className= 'space-y-6'>
          <Heading level= { 3 }>
            { i18n.t( $ => $.settings.displayTitle ) }
          </Heading>

          <div className= 'grid grid-cols-1 md:grid-cols-3 gap-6'>
            <Select
              label= { i18n.t( $ => $.settings.language ) }
              value= { formState.display.language }
              options= { languageOptions }
              onChange= { e => handleDisplayChange( 'language', e.target.value as any ) }
            />

            <Select
              label= { i18n.t( $ => $.settings.currency ) }
              value= { formState.display.currency }
              options= { currencyOptions }
              onChange= { e => handleDisplayChange( 'currency', e.target.value as any ) }
            />

            <Select
              label= { i18n.t( $ => $.settings.decimals ) }
              value= { formState.display.decimals }
              options= { decimalOptions }
              onChange= { e => handleDisplayChange( 'decimals', Number( e.target.value ) ) }
            />
          </div>
        </Card>

        <Card className= 'space-y-6'>
          <Heading level= { 3 }>
            { i18n.t( $ => $.settings.profileTitle ) }
          </Heading>

          <div className= 'grid grid-cols-1 md:grid-cols-2 gap-6'>
            <Input
              type= 'date'
              label= { i18n.t( $ => $.settings.birthDate ) }
              value= { formState.profile.birthDate }
              onChange= { e => handleProfileChange( 'birthDate', e.target.value ) }
            />

            <Select
              label= { i18n.t( $ => $.settings.gender ) }
              value= { formState.profile.gender }
              options= { genderOptions }
              onChange= { e => handleProfileChange( 'gender', e.target.value as any ) }
            />
          </div>
        </Card>

        <div className= 'flex justify-end items-center gap-4'>
          { success && (
            <span className= 'font-medium text-sm text-pos animate-fade-in'>
              { i18n.t( $ => $.settings.savedSuccess ) }
            </span>
          ) }
          <Button type= 'submit' variant= 'primary'>
            { i18n.t( $ => $.settings.save ) }
          </Button>
        </div>
      </form>
    </div>
  );
};
