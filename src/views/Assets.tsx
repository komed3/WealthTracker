import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import i18n from '@/src/lib/i18n';
import { useEffect } from 'react';

export const Assets = () => {
  const { data, settings } = useData();
  const { setTitle } = useLayout();
  const display = settings!.display;

  useEffect( () => { setTitle( i18n.t( $ => $.assets.title ) ) }, [ setTitle, display.language ] );

  const entries = data?.entries ?? [];
  const computed = data?.computed;

  return ( <></> );
};
