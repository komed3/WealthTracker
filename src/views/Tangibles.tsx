import { Coins, Gem, Sandwich, Clock, Calendar, Smartphone, MapPin, Info } from 'lucide-react';

import { TangiblesProps } from '../types';
import { calculatePercentile } from '../utils';

import PageHeader from '../components/PageHeader';


// Average values ( approximate )
const VALUES = {
    gold_g: 140, silver_kg: 2250, big_mac: 5.50, work_hour_de: 25, iphone: 1000,
    living_costs: { US: 3500, DE: 2500, CH: 5000, PK: 400, IN: 600 }
};

export default function Tangibles ( { data, t }: TangiblesProps ) {
    const years = Object.keys( data.stats.yearly ).sort();
    const latestYear = years[ years.length - 1 ];
    const totalWealth = data.stats.yearly[ latestYear ]?.total || 0;

    const percentile = calculatePercentile( totalWealth );
    const rank = Math.round( ( percentile / 100 ) * 8e9 );

    // Conversion logic
    const items = [ {
        id: 'gold',
        label: t.tangibles.gold,
        value: totalWealth / VALUES.gold_g,
        icon: <Gem className="text-amber-500" />
    }, {
        id: 'silver',
        label: t.tangibles.silver,
        value: totalWealth / VALUES.silver_kg,
        icon: <Coins className="text-slate-400" />
    }, {
        id: 'burgers',
        label: t.tangibles.burgers,
        value: totalWealth / VALUES.big_mac,
        icon: <Sandwich className="text-orange-500" />
    }, {
        id: 'workHours',
        label: t.tangibles.workHours,
        value: totalWealth / VALUES.work_hour_de,
        icon: <Clock className="text-blue-500" />
    }, {
        id: 'workMonths',
        label: t.tangibles.workMonths,
        value: totalWealth / ( VALUES.work_hour_de * 160 ),
        icon: <Calendar className="text-indigo-500" />
    }, {
        id: 'electronics',
        label: t.tangibles.electronics,
        value: totalWealth / VALUES.iphone,
        icon: <Smartphone className="text-zinc-800" />
    } ];

    const countries = [
        { name: 'USA', code: 'US', color: 'bg-blue-600' },
        { name: 'Germany', code: 'DE', color: 'bg-amber-500' },
        { name: 'Switzerland', code: 'CH', color: 'bg-red-600' },
        { name: 'Pakistan', code: 'PK', color: 'bg-emerald-600' },
        { name: 'India', code: 'IN', color: 'bg-orange-600' }
    ];

    return ( <div className="p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <PageHeader title={t.tangibles.title} subtitle={t.tangibles.description} />

        {/* Global Status Section */}
        <div className="bg-brand-900 text-white p-8 rounded-3xl shadow-xl shadow-brand-900/20 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-800 rounded-full -ml-32 -mb-32 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                    <p className="text-[10px] font-bold text-brand-300 uppercase tracking-[0.2em] mb-3">{t.tangibles.percentile}</p>
                    <h3 className="text-4xl md:text-5xl font-mono font-bold mb-2">
                        { t.tangibles.top.replace( '{percent}', percentile.toFixed( 2 ) ) }
                    </h3>
                    <p className="text-brand-300 text-sm font-light">{t.tangibles.comparedTo}</p>
                </div>
                <div className="flex flex-col md:items-end">
                    <p className="text-[10px] font-bold text-brand-300 uppercase tracking-[0.2em] mb-3 md:text-right">{t.tangibles.rank}</p>
                    <h3 className="text-3xl md:text-4xl font-mono font-bold mb-2 md:text-right">
                        { t.tangibles.rankOf.replace( '{rank}', rank.toLocaleString() ) }
                    </h3>
                    <div className="flex items-center gap-2 text-brand-300 text-sm font-light md:justify-end">
                        <MapPin size={14} />
                        <span>{t.tangibles.comparedTo}</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Grid of items */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                { items.map( ( item ) => ( <div key={item.id} className="bg-white p-6 rounded-2xl border border-brand-100 shadow-sm flex flex-col justify-between min-h-[160px]">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-white rounded-xl shadow-sm">{item.icon}</div>
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-brand-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <p className="text-3xl font-mono font-bold text-brand-900">
                            { item.value.toLocaleString( undefined, { maximumFractionDigits: 1 } ) }
                        </p>
                    </div>
                </div> ) ) }
            </div>

            {/* Living Costs Section */}
            <div className="bg-white p-6 rounded-2xl border border-brand-200 shadow-sm">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
                        <MapPin className="text-brand-900" size={20} />
                    </div>
                    <h3 className="text-lg font-medium text-brand-900">{t.tangibles.living}</h3>
                </div>

                <div className="space-y-8">{ ( () => {
                    const countryStats = countries.map(c => ( { ...c, months: totalWealth / VALUES.living_costs[
                        c.code as keyof typeof VALUES.living_costs
                    ] } ) );
                    const maxMonths = Math.max( ...countryStats.map( c => c.months ) );

                    return countryStats.map( ( country ) => {
                        const cost = VALUES.living_costs[ country.code as keyof typeof VALUES.living_costs ];
                        const percentage = maxMonths > 0 ? ( country.months / maxMonths ) * 100 : 0;

                        return ( <div key={country.code} className="group">
                            <div className="flex justify-between items-end mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${country.color}`} />
                                    <span className="text-xs font-semibold text-brand-900">{country.name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-lg font-mono font-bold text-brand-900">
                                        { country.months.toLocaleString( undefined, { maximumFractionDigits: 1 } ) }
                                    </span>
                                    <span className="text-[10px] text-brand-400 ml-1 uppercase">{t.tangibles.months}</span>
                                </div>
                            </div>
                            <div className="h-1.5 w-full bg-brand-50 rounded-full overflow-hidden mb-1.5">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${country.color}`}
                                    style={ { width: `${percentage}%` } }
                                />
                            </div>
                            <p className="text-[8px] text-brand-400 uppercase tracking-widest">
                                {t.tangibles.avgCost}: { cost.toLocaleString() } {data.settings.currency} / {t.common.month || 'mo'}
                            </p>
                        </div> );
                    } );
                } )() }</div>
            </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-brand-200 flex gap-4 items-center shadow-sm">
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                <Info className="text-brand-900" size={20} />
            </div>
            <p className="text-xs text-brand-500 leading-relaxed italic">{t.tangibles.note}</p>
        </div>
    </div> );
}
