import { Sparkles, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

import { InsightProps } from '../types';
import { calculateDataHash, generateAiInsights } from '../services/geminiService';
import PageHeader from '../components/PageHeader';
import StrategyChart from '../components/StrategyChart';


export default function Insight ( { data, setData, t, type, title }: InsightProps ) {
    const [ loading, setLoading ] = useState( false );
    const [ error, setError ] = useState< string | null >( null );

    const years = Object.keys( data.stats.yearly ).sort();
    const latestYear = years[ years.length - 1 ];
    const totalWealth = data.stats.yearly[ latestYear ]?.total || 0;

    const insight = data.aiInsights?.[ type ];
    const currentHash = calculateDataHash( data );
    const isStale = insight && insight.dataHash !== currentHash;
    const isWrongLanguage = insight && insight.language !== data.settings.language;

    const handleUpdate = async () => {
        setLoading( true );
        setError( null );

        try {
            const content = await generateAiInsights( data, type );
            const newInsights = { ...( data.aiInsights || {} ), [ type ]: {
                content,
                lastUpdated: new Date().toISOString(),
                dataHash: currentHash,
                language: data.settings.language
            } };

            const newData = { ...data, aiInsights: newInsights };
            const response = await fetch( '/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify( newData )
            } );

            if ( ! response.ok ) throw new Error( 'Failed to save AI insights' );
            setData( newData );
        } catch ( err ) {
            setError( err instanceof Error ? err.message : 'An unknown error occurred' );
        } finally {
            setLoading( false );
        }
    };

    useEffect( () => { if ( ! insight ) handleUpdate() }, [] );

    return ( <div className="p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <PageHeader title={title} />
            <button
                onClick={handleUpdate} disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-brand-900 text-white rounded-xl hover:bg-brand-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-900/10 cursor-pointer"
            >
                { loading ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} /> }
                <span className="text-sm font-medium">{t.ai.update}</span>
            </button>
        </div>

        { ( isStale || isWrongLanguage ) && ! loading && ( <div className="mb-6 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3 text-amber-800">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-xs font-medium">
                { isWrongLanguage ? t.ai.languageMismatch : t.ai.staleData }
            </p>
        </div> ) }

        { error && ( <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-800">
            <AlertCircle size={20} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
        </div> ) }

        { type === 'strategy' && ! loading && insight && ( <StrategyChart totalWealth={totalWealth} currentYear={
            parseInt( latestYear ) || new Date().getFullYear()
        } currency={data.settings.currency} t={t} /> ) }

        <div className="bg-white rounded-2xl border border-brand-200 shadow-sm overflow-hidden min-h-[400px ] relative">
            { loading ? ( <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                <RefreshCw size={40} className="text-brand-900 animate-spin mb-4" />
                <p className="text-brand-600 font-medium animate-pulse">{t.ai.loading}</p>
            </div> ) : insight ? ( <div className="p-6 md:p-10">
                <div className="flex items-center gap-2 text-[10px] text-brand-400 uppercase tracking-widest mb-8 border-b border-brand-100 pb-4">
                    <Clock size={12} />
                    <span>{t.ai.lastUpdated}: { new Date( insight.lastUpdated ).toLocaleString() }</span>
                </div>
                <div className="prose prose-slate max-w-none prose-sm md:prose-base prose-headings:font-light prose-headings:tracking-tight prose-headings:text-brand-900 prose-p:text-brand-600 prose-strong:text-brand-900 prose-li:text-brand-600">
                    <Markdown>{insight.content}</Markdown>
                </div>
            </div> ) : ( <div className="flex flex-col items-center justify-center h-[400px] text-brand-400">
                <Sparkles size={48} className="mb-4 opacity-20" />
                <p>{t.ai.noContent}</p>
            </div> ) }
        </div>
    </div> );
}
