import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';


export function cn ( ...inputs: ClassValue[] ) : string {
    return twMerge( clsx( inputs ) );
}

export const calculatePercentile = ( wealth: number ) => {
    if ( wealth <= 0 ) return 99;

    const points = [
        { w: 0, p: 100 }, { w: 1000, p: 80 }, { w: 10000, p: 50 },
        { w: 50000, p: 25 }, { w: 137000, p: 10 }, { w: 500000, p: 3 },
        { w: 1081000, p: 1 }, { w: 5000000, p: 0.1 },
        { w: 50000000, p: 0.01 }
    ];

    for ( let i = 0; i < points.length - 1; i++ ) {
        if ( wealth >= points[ i ].w && wealth <= points[ i + 1 ].w ) {
            const t = ( wealth - points[ i ].w ) / ( points[ i + 1 ].w - points[ i ].w );
            return points[ i ].p + t * ( points[ i + 1 ].p - points[ i ].p );
        }
    }

    return 0.01;
};

export const formatCompactCurrency = ( val: number ) : string => {
    if ( val >= 1000000 ) return `${ ( val / 1000000 ).toFixed( 1 ) }M`;
    if ( val >= 1000 ) return `${ ( val / 1000 ).toFixed( 0 ) }k`;
    return val.toString();
};

export const CHART_TOOLTIP_STYLE = {
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 20px 25px -5px rgb( 0 0 0 / 0.1 )',
    fontSize: '14px',
    lineHeight: '1.1',
    padding: '8px 12px'
};
