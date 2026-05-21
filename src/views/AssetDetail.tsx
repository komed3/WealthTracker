import { useData } from '@/src/context/DataCtx';
import { useLayout } from '@/src/context/LayoutCtx';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';

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

  return (
    <div className= 'space-y-8'>
      { /** Page Header */ }
      <div className= 'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-slate-200'>
        { /** Asset Title */ }
        <div className= 'flex items-center gap-4 min-w-0'>
          <Link
            to= '/assets'
            className= {
              'flex justify-center items-center shrink-0 w-10 h-10 text-slate-500 hover:text-slate-800 ' +
              'bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all'
            }>
              <ArrowLeft size= { 20 } />
          </Link>
        </div>
      </div>
    </div>
  );
};
