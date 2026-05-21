import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

export const AssetDetail = () => {
  const { assetId } = useParams < { assetId: string } > ();
  const navigate = useNavigate();
  const { setTitle } = useLayout();

  const { data, settings } = useData();
  const assetData = data?.entries.filter( r => r.entry.id === assetId )[ 0 ];
  const display = settings!.display;

  useEffect( () => { if ( ! assetId || ! assetData ) navigate( '/assets', { replace: true } ) }, [ assetId, navigate ] );
  if ( ! assetId || ! assetData ) return null;

  useEffect( () => { setTitle( assetData.entry.title ) }, [ setTitle, display.language ] );

  return ( <></> );
};
