import { GoogleGenAI } from '@google/genai';
import { aiInsights, AppData } from '../types';


const MODEL_NAME = 'gemini-3.1-pro-preview';

export async function generateAiInsights( data: AppData, type: aiInsights ) : Promise< string > {
    const apiKey = process.env.GEMINI_API_KEY;
    if ( ! apiKey ) throw new Error( 'GEMINI_API_KEY is not set' );

    const ai = new GoogleGenAI( { apiKey } );

    const language = data.settings.language === 'de' ? 'German' : 'English';
    const currency = data.settings.currency;

    const dataSummary = JSON.stringify( {
        categories: data.categories.map( c => ( {
            name: c.name, rubric: c.rubric,
            latestValue: Object.entries( c.values ).sort().pop()?.[ 1 ] || 0
        } ) ),
        stats: data.stats.yearly
    } );

    let prompt = '';
    if ( type === 'analysis' ) prompt = `
        Analyze the current financial state of this portfolio.
        Focus on rubric distribution, category diversity, growth rates, and stability.
        Provide a professional and insightful analysis in ${language}.
        Use ${currency} as the currency.
        Format the output in Markdown with clear headings ( ## ), bold text for emphasis, and bullet points for key findings.
        Data: ${dataSummary}
    `; else if ( type === 'narrative' ) prompt = `
        Write a detailed historical narrative of this wealth development over the years.
        Describe the journey, key milestones, and overall trend in ${language}.
        Use ${currency} as the currency.
        Format the output in Markdown with clear headings ( ## ) for different phases or years, and descriptive paragraphs.
        Data: ${dataSummary}
    `; else if ( type === 'strategy' ) prompt = `
        Sketch a future strategy to further strengthen this wealth portfolio.
        Provide different concepts based on risk tolerance ( Conservative, Balanced, Aggressive ).
        Include actionable advice in ${language}.
        Use ${currency} as the currency.
        Format the output in Markdown with clear headings ( ## ) for each strategy level, and use lists for specific recommendations.
        Data: ${dataSummary}
    `;

    const response = await ai.models.generateContent( {
        model: MODEL_NAME, contents: prompt
    } );

    return response.text;
}

export function calculateDataHash ( data: AppData ) : string {
    const str = JSON.stringify( data.categories );
    let hash = 0;

    for ( let i = 0; i < str.length; i++ ) {
        const char = str.charCodeAt( i );
        hash = ( ( hash << 5 ) - hash ) + char;
        hash = hash & hash;
    }

    return hash.toString();
}
