export type Rubric = 'liquid' | 'funds' | 'bound' | 'tangibles' | 'liabilities' | 'pension';

export interface Category {
    id: string;
    name: string;
    rubric: Rubric;
    color: string;
    icon: string;
    values: Record< string, number >;
}

export interface YearlyStats {
    year: string;
    total: number;
    byRubric: Record< Rubric, number >;
    growthRate: number;
    categoryShares: Record< string, number >;
    stability: number;
    inflationValue: number;
}

export interface AppData {
    settings: {
        currency: string;
        language: 'en' | 'de';
    };
    categories: Category[];
    stats: {
        yearly: Record< string, YearlyStats >;
    };
    aiInsights?: {
        [ key in 'analysis' | 'narrative' | 'strategy' ]?: {
            content: string;
            lastUpdated: string;
            dataHash: string;
            language: string;
        };
    };
}


export const CURRENCIES = [ 'EUR', 'USD', 'GBP', 'CHF', 'JPY' ];
export const LANGUAGES = [ 'en', 'de' ];
