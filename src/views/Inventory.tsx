import { Wallet } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { InventoryProps } from '../types';
import { ICON_MAP } from '../constants/icons';

import PageHeader from '../components/PageHeader';


export default function Inventory ( { data, t }: InventoryProps ) {
    const years = Object.keys( data.stats?.yearly || {} ).sort();
    const latestYear = years[ years.length - 1 ];
    const latestStats = latestYear ? data.stats.yearly[ latestYear ] : null;

    return ( <div className="p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <PageHeader title={t.nav.inventory} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{ data.categories.map( cat => {
            const IconComp = ICON_MAP[ cat.icon || 'Wallet' ] || Wallet;
            const currentVal = latestYear ? ( cat.values[ latestYear ] || 0 ) : 0;
            const currentShare = latestStats?.categoryShares[ cat.id ] || 0;

            // Prepare chart data for this category's share over time
            const chartData = years.map( year => (
                { year, share: data.stats.yearly[ year ]?.categoryShares[ cat.id ] || 0 }
            ) );

            return ( <div key={cat.id} className="bg-white rounded-lg border border-brand-200 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 border-b border-brand-100 flex items-center gap-4">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                        style={ { backgroundColor: cat.color } }
                    ><IconComp size={20} /></div>
                    <div className="min-w-0">
                        <h3 className="font-semibold text-brand-900 truncate">{cat.name}</h3>
                        <p className="text-[10px] uppercase tracking-widest text-brand-400 font-bold">{ t.rubrics[ cat.rubric ] }</p>
                    </div>
                </div>

                <div className="p-6 flex-1 space-y-6">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-brand-400 font-bold mb-1">{t.common.currentValue}</p>
                            <p className="text-2xl font-mono font-medium text-brand-900">
                                { currentVal.toLocaleString( undefined, { minimumFractionDigits: 2 } ) }
                                <span className="text-sm font-sans text-brand-400">{data.settings.currency}</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] uppercase tracking-widest text-brand-400 font-bold mb-1">{t.common.share}</p>
                            <p className="text-lg font-mono font-medium text-brand-600">{ currentShare.toFixed( 1 ) }%</p>
                        </div>
                    </div>

                    <div className="h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id={ `gradient-${cat.id}` } x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={cat.color} stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor={cat.color} stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="year" hide />
                                <Area
                                    type="monotone"
                                    dataKey="share"
                                    stroke={cat.color}
                                    fillOpacity={1}
                                    fill={ `url(#gradient-${cat.id})` }
                                    strokeWidth={2}
                                />
                                <Tooltip content={ ( { active, payload, label } ) => {
                                    if ( active && payload && payload.length ) {
                                        const year = label;
                                        const share = payload[ 0 ].value as number;
                                        const absoluteValue = cat.values[ year ] || 0;

                                        return ( <div className="bg-white p-3 border border-brand-200 shadow-xl rounded-lg text-[13px] leading-[1.1] font-sans">
                                            <p className="font-bold text-brand-900 mb-1">{year}</p>
                                            <p className="text-brand-600 mb-0.5">
                                                {t.common.share}: <span className="font-mono font-semibold">{ share.toFixed( 1 ) }%</span>
                                            </p>
                                            <p className="text-brand-400">
                                                {t.common.currentValue}: <span className="font-mono font-semibold">{
                                                    absoluteValue.toLocaleString( undefined, { minimumFractionDigits: 2 } )
                                                } {data.settings.currency}</span>
                                            </p>
                                        </div> );
                                    }

                                    return null;
                                } } />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div> );
        } ) }</div>
    </div> );
}
