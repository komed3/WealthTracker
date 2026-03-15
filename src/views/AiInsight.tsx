import { Sparkles, RefreshCw, AlertCircle, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';

import { AiInsightViewProps } from '../types';
import { calculateDataHash, generateAiInsights } from '../services/geminiService';
import PageHeader from '../components/PageHeader';
import StrategyChart from '../components/StrategyChart';


export default function AiInsightView ( { data, setData, t, type, title }: AiInsightViewProps ) {
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
}
