import { TrendingUp, ArrowUpRight, ArrowDownRight, Wallet, Globe, History } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';

import { SnapshotProps } from '../types';
import { calculatePercentile, CHART_TOOLTIP_STYLE, formatCompactCurrency } from '../utils';

import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';


export default function Snapshot ( { data, t }: SnapshotProps ) {
    const years = Object.keys( data.stats?.yearly || {} ).sort();
    const latestYear = years[ years.length - 1 ];
    const latestStats = latestYear ? data.stats.yearly[ latestYear ] : null;

    // Use server-side calculated inflation logic
    const chartData = years.map( ( year ) => {
        const stats = data.stats.yearly[ year ];
        return { year, total: stats.total, inflation: stats.inflationValue };
    } );

    const stability = latestStats?.stability || 0;

    const stats = [ {
        label: t.snapshot.netWorth,
        value: latestStats ? `${ latestStats.total.toLocaleString() } ${data.settings.currency}` : '0 ' + data.settings.currency,
        icon: <Wallet className="text-brand-900" size={24} />,
        color: 'bg-brand-50'
    }, {
        label: t.snapshot.annualGrowth,
        value: latestStats ? `${ latestStats.growthRate >= 0 ? '+' : '' }${ latestStats.growthRate.toFixed( 1 ) }%` : '0%',
        icon: latestStats?.growthRate && latestStats.growthRate >= 0 ? <ArrowUpRight className="text-emerald-600" size={24} /> : <ArrowDownRight className="text-red-600" size={24} />,
        color: latestStats?.growthRate && latestStats.growthRate >= 0 ? 'bg-emerald-50' : 'bg-red-50'
    }, {
        label: t.tangibles?.percentile || 'Global Ranking',
        value: `Top ${ calculatePercentile( latestStats ? latestStats.total : 0 ).toFixed( 2 ) }%`,
        icon: <Globe className="text-indigo-600" size={24} />,
        color: 'bg-indigo-50'
    }, {
        label: t.snapshot.stability,
        value: `${stability}%`,
        icon: <TrendingUp className="text-amber-600" size={24} />,
        color: 'bg-amber-50'
    } ];

    return ( <div className="p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <PageHeader title={t.snapshot.history} />

        {/* Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            { stats.map( ( stat, i ) => ( <StatCard key={i} {...stat} /> ) ) }
        </div>

        {/* Main Chart */}
        <div className="bg-white p-6 rounded-xl border border-brand-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <History className="text-brand-900" size={20} />
                <h3 className="text-lg font-medium text-brand-900">{t.snapshot.history}</h3>
            </div>

            <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={ { top: 10, right: 10, left: 0, bottom: 0 } }>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            tick={ { fill: '#94a3b8', fontSize: 11 } }
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={ { fill: '#94a3b8', fontSize: 11 } }
                            width={35}
                            tickFormatter={formatCompactCurrency}
                        />
                        <Tooltip
                            contentStyle={CHART_TOOLTIP_STYLE}
                            formatter={ ( value: number, name: string ) => {
                                const label = name === 'total' ? t.snapshot.netWorth : t.snapshot.inflation;
                                return [ `${ value.toLocaleString( undefined, { maximumFractionDigits: 0 } ) } ${data.settings.currency}`, label ];
                            } }
                            itemSorter={ ( item ) => ( item.dataKey === 'total' ? -1 : 1 ) }
                        />
                        <Area
                            type="monotone"
                            dataKey="total"
                            stroke="#0f172a"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorTotal)"
                            animationDuration={2000}
                        />
                        <Line
                            type="monotone"
                            dataKey="inflation"
                            stroke="#94a3b8"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                            animationDuration={2000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div> );
}
