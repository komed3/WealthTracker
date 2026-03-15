import { LineChart as ChartIcon } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';

import { CHART_TOOLTIP_STYLE, formatCompactCurrency } from '../utils';
import { StrategyChartProps } from '../types';


export default function StrategyChart ( { totalWealth, currentYear, currency, t }: StrategyChartProps ) {
    const years = Array.from( { length: 11 }, ( _, i ) => i );
    const chartData = years.map( year => ( {
        year: ( currentYear + year ).toString(),
        conservative: Math.round( totalWealth * Math.pow( 1.03, year ) ),
        balanced: Math.round( totalWealth * Math.pow( 1.05, year ) ),
        aggressive: Math.round( totalWealth * Math.pow( 1.08, year ) )
    } ) );

    return ( <div className="bg-white p-6 rounded-2xl border border-brand-200 shadow-sm mb-8">
        <div className="flex items-center gap-3 mb-6">
            <ChartIcon className="text-brand-900" size={20} />
            <h3 className="text-lg font-medium text-brand-900">{t.ai.projection}</h3>
        </div>
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={ { top: 10, right: 10, left: 0, bottom: 0 } }>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={ { fill: '#94a3b8', fontSize: 11 } } />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={ { fill: '#94a3b8', fontSize: 11 } }
                        tickFormatter={formatCompactCurrency}
                        width={40}
                    />
                    <RechartsTooltip
                        contentStyle={CHART_TOOLTIP_STYLE}
                        formatter={ ( val: number ) => [ `${ val.toLocaleString() } ${currency}`, '' ] }
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Line type="monotone" dataKey="conservative" stroke="#94a3b8" strokeWidth={3} dot={false} name={t.ai.conservativeLabel} />
                    <Line type="monotone" dataKey="balanced" stroke="#6366f1" strokeWidth={3} dot={false} name={t.ai.balancedLabel} />
                    <Line type="monotone" dataKey="aggressive" stroke="#0f172a" strokeWidth={3} dot={false} name={t.ai.aggressiveLabel} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div> );
}
