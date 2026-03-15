import { ArrowUpRight, ArrowDownRight, DollarSign, Percent } from 'lucide-react';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { MomentumProps } from '../types';
import { CHART_TOOLTIP_STYLE, formatCompactCurrency } from '../utils';

import PageHeader from '../components/PageHeader';


export default function Momentum ( { data, t }: MomentumProps ) {
    const [ viewMode, setViewMode ] = useState< 'currency' | 'percent' >( 'currency' );
    const years = Object.keys( data.stats.yearly ).sort();

    const momentumData = years.slice( 1 ).map( ( year ) => {
        const stats = data.stats.yearly[ year ];
        const prevYear = years[ years.indexOf( year ) - 1 ];

        const changeValue = stats.total - data.stats.yearly[ prevYear ].total;
        const inflationLoss = stats.total - stats.inflationValue;

        return {
            year, total: stats.total, changeValue, growthRate: stats.growthRate,
            inflationLoss, isPositive: stats.growthRate >= 0
        };
    } );

    return ( <div className="p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <PageHeader title={t.nav.momentum} />

            <div className="flex bg-brand-100 p-1 rounded-lg border border-brand-200">
                <button
                    onClick={ () => setViewMode( 'currency' ) }
                    className={ `flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                        viewMode === 'currency' ? 'bg-white shadow-sm text-brand-900' : 'text-brand-400 hover:text-brand-600'
                    }` }
                >
                    <DollarSign size={12} />
                    {data.settings.currency}
                </button>
                <button
                    onClick={ () => setViewMode( 'percent' ) }
                    className={ `flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                        viewMode === 'percent' ? 'bg-white shadow-sm text-brand-900' : 'text-brand-400 hover:text-brand-600'
                    }` }
                >
                    <Percent size={12} />
                    {t.common.share}
                </button>
            </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-lg border border-brand-200 shadow-sm mb-8">
            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={momentumData} margin={ { top: 10, right: 10, left: 0, bottom: 0 } }>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey='year'
                            axisLine={false}
                            tickLine={false}
                            tick={ { fill: '#94a3b8', fontSize: 11 } }
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={ { fill: '#94a3b8', fontSize: 11 } }
                            tickFormatter={ ( val ) => viewMode === 'currency' ? formatCompactCurrency( val ) : `${val}%` }
                            width={40}
                        />
                        <Tooltip
                            cursor={ { fill: '#f8fafc' } }
                            contentStyle={CHART_TOOLTIP_STYLE}
                            formatter={ ( value: number ) => [
                                viewMode === 'currency'
                                    ? `${ value.toLocaleString( undefined, { maximumFractionDigits: 0 } ) } ${data.settings.currency}`
                                    : `${ value.toFixed( 2 ) }%`,
                                viewMode === 'currency' ? t.common.change : t.common.growth
                            ] }
                        />
                        <Bar
                            dataKey={ viewMode === 'currency' ? 'changeValue' : 'growthRate' }
                            radius={ [ 4, 4, 0, 0 ] }
                        >{ momentumData.map( ( entry, index ) => ( <Cell
                            key={ `cell-${index}` }
                            fill={ entry.isPositive ? '#10b981' : '#ef4444' }
                        /> ) ) }</Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg border border-brand-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-brand-50 border-b border-brand-200">
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-brand-400">{t.common.year}</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-brand-400">{t.common.total}</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-brand-400">{t.common.change}</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-brand-400">{t.common.growth}</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-brand-400 text-right">{t.common.inflLoss}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-brand-100">{ momentumData.slice().reverse().map( ( item ) => (
                    <tr key={item.year} className="hover:bg-brand-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-brand-900">{item.year}</td>
                        <td className="px-6 py-4 font-mono text-brand-900">
                            { item.total.toLocaleString( undefined, { minimumFractionDigits: 2 } ) }
                            <span className="text-[10px] text-brand-400">{data.settings.currency}</span>
                        </td>
                        <td className={ `px-6 py-4 font-mono font-medium ${ item.changeValue >= 0 ? 'text-emerald-600' : 'text-red-600' }` }>
                            <div className="flex items-center gap-1">
                                { item.changeValue >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} /> }
                                { Math.abs( item.changeValue ).toLocaleString( undefined, { minimumFractionDigits: 2 } ) }
                            </div>
                        </td>
                        <td className={ `px-6 py-4 font-mono font-bold ${ item.growthRate >= 0 ? 'text-emerald-600' : 'text-red-600' }` }>
                            { item.growthRate >= 0 ? '+' : '' }{ item.growthRate.toFixed( 2 ) }%
                        </td>
                        <td className="px-6 py-4 font-mono font-medium text-red-500 text-right text-sm">
                            { item.inflationLoss < 0 ? item.inflationLoss.toLocaleString( undefined, { maximumFractionDigits: 0 } ) : 0 }
                            <span className="text-[10px] opacity-70">{data.settings.currency}</span>
                        </td>
                    </tr>
                ) ) }</tbody>
            </table>
        </div>
    </div> );
}
