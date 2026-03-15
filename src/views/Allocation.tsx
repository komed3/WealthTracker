import { Wallet, Layers, List } from 'lucide-react';
import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import { AllocationProps } from '../types';
import { CHART_TOOLTIP_STYLE, formatCompactCurrency } from '../utils';
import { ICON_MAP } from '../constants/icons';

import PageHeader from '../components/PageHeader';


export default function Allocation ( { data, t }: AllocationProps ) {
    const years = Object.keys( data.stats?.yearly || {} ).sort();
    const [ selectedYear, setSelectedYear ] = useState( years[ years.length - 1 ] || '' );
    const [ viewMode, setViewMode ] = useState< 'categories' | 'rubrics' >( 'categories' );
    const latestStats = selectedYear ? data.stats.yearly[ selectedYear ] : null;

    function getRubricColor ( rubric: string ) : string {
        const firstCat = data.categories.find( c => c.rubric === rubric );
        return firstCat?.color || '#cbd5e1';
    }

    // Data for Doughnut Chart
    const pieData = ( viewMode === 'categories'
        ? data.categories.map( cat => ( {
            name: cat.name, value: selectedYear ? ( cat.values[ selectedYear ] || 0 ) : 0,
            color: cat.color, icon: cat.icon, id: cat.id
        } ) )
        : Object.entries( latestStats?.byRubric || {} ).map( ( [ rubric, value ] ) => ( {
            name: t.rubrics[ rubric ] || rubric, value: value as number,
            color: getRubricColor( rubric ), id: rubric, icon: 'Layers'
        } ) )
    ).filter( d => d.value > 0 ).sort( ( a, b ) => b.value - a.value );

    // Data for Stacked Bar Chart
    const barData = years.map( year => {
        const stats = data.stats.yearly[ year ];
        const entry: any = { year };

        if ( viewMode === 'categories' ) data.categories.forEach(
            cat => { entry[ cat.id ] = cat.values[ year ] || 0 }
        );
        else if ( stats ) Object.entries( stats.byRubric ).forEach(
            ( [ rubric, value ] ) => { entry[ rubric ] = value }
        );

        return entry;
    } );

    const totalValue = pieData.reduce( ( acc, curr ) => acc + ( curr.value as number ), 0 );

    return ( <div className="p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <PageHeader title={t.nav.allocation} />

            <div className="flex items-center gap-3">
                <div className="flex bg-brand-100 p-1 rounded-lg border border-brand-200">
                    <button
                        onClick={ () => setViewMode( 'categories' ) }
                        className={ `flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                            viewMode === 'categories' ? 'bg-white shadow-sm text-brand-900' : 'text-brand-400 hover:text-brand-600'
                        }` }
                    >
                        <List size={12} />
                        {t.common.categories}
                    </button>
                    <button
                        onClick={ () => setViewMode( 'rubrics' ) }
                        className={ `flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                            viewMode === 'rubrics' ? 'bg-white shadow-sm text-brand-900' : 'text-brand-400 hover:text-brand-600'
                        }` }
                    >
                        <Layers size={12} />
                        {t.common.rubrics}
                    </button>
                </div>

                <select
                    value={selectedYear}
                    onChange={ ( e ) => setSelectedYear( e.target.value ) }
                    className="bg-white border border-brand-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-brand-900 focus:ring-brand-500 focus:border-brand-500"
                >{ years.map( y => <option key={y} value={y}>{y}</option> ) }</select>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Doughnut Chart Section */}
            <div className="bg-white p-6 rounded-lg border border-brand-200 shadow-sm flex flex-col items-center">
                <div className="h-[450px] w-full relative">
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest">{t.common.total}</p>
                        <p className="text-2xl font-mono font-bold text-brand-900">
                            { totalValue.toLocaleString( undefined, { maximumFractionDigits: 0 } ) }
                        </p>
                        <p className="text-xs text-brand-400">{data.settings.currency}</p>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={110}
                                outerRadius={160}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                            >{ pieData.map( ( entry, index ) => (
                                <Cell key={ `cell-${index}` } fill={entry.color} />
                            ) ) }</Pie>
                            <Tooltip formatter={ ( value: number, name: string ) => [
                                `${ value.toLocaleString( undefined, { maximumFractionDigits: 2 } ) } ${data.settings.currency} ( ${
                                    totalValue > 0 ? ( ( value / totalValue ) * 100 ).toFixed( 1 ) : 0
                                }% )`, name
                            ] } contentStyle={CHART_TOOLTIP_STYLE} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Legend Section */}
            <div className="bg-white p-6 rounded-lg border border-brand-200 shadow-sm overflow-y-auto max-h-[514px]">
                <h3 className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-4">{t.common.share}</h3>
                <div className="space-y-3">{ pieData.map( ( item ) => {
                    const IconComp = viewMode === 'categories' ? ( ICON_MAP[ item.icon || 'Wallet' ] || Wallet ) : Layers;
                    const share = totalValue > 0 ? ( item.value / totalValue ) * 100 : 0;

                    return ( <div key={item.id} className="flex items-center gap-3 group">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 transition-transform group-hover:scale-110"
                            style={ { backgroundColor: item.color } }
                        >
                            <IconComp size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between mb-1">
                                <span className="text-xs font-semibold text-brand-900 truncate">{item.name}</span>
                                <span className="text-xs font-mono font-bold text-brand-600">{ share.toFixed( 1 ) }%</span>
                            </div>
                            <div className="h-1 w-full bg-brand-50 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={ { width: `${share}%`, backgroundColor: item.color } }
                                />
                            </div>
                        </div>
                    </div> );
                } ) }</div>
            </div>
        </div>

        {/* Stacked Bar Chart Section */}
        <div className="bg-white p-6 rounded-lg border border-brand-200 shadow-sm">
            <div className="mb-6">
                <h3 className="text-lg font-medium text-brand-900 mb-1">{t.common.allYears}</h3>
                <p className="text-[10px] text-brand-400">{t.common.allocation}</p>
            </div>

            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={ { top: 10, right: 10, left: 0, bottom: 0 } }>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="year"
                            axisLine={false}
                            tickLine={false}
                            tick={ { fill: '#94a3b8', fontSize: 10 } }
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={ { fill: '#94a3b8', fontSize: 10 } }
                            tickFormatter={formatCompactCurrency}
                        />
                        <Tooltip
                            cursor={ { fill: '#f8fafc' } }
                            contentStyle={CHART_TOOLTIP_STYLE}
                            formatter={ ( value: number, name: string ) => [
                                `${ value.toLocaleString() } ${data.settings.currency}`, name
                            ] }
                        />
                        { viewMode === 'categories' ? ( data.categories.map( cat => (
                            <Bar
                                key={cat.id}
                                dataKey={cat.id}
                                stackId="a"
                                fill={cat.color}
                                name={cat.name}
                                radius={ [ 0, 0, 0, 0 ] }
                                stroke="#fff"
                                strokeWidth={1}
                            /> ) ) ) : ( years.length > 0 && data.stats.yearly[ years[ 0 ] ] ? (
                                Object.keys( data.stats.yearly[ years[ 0 ] ].byRubric ).map( rubric => (
                                    <Bar
                                        key={rubric}
                                        dataKey={rubric}
                                        stackId="a"
                                        fill={ getRubricColor( rubric )}
                                        name={ t.rubrics[ rubric ] || rubric }
                                        stroke="#fff"
                                        strokeWidth={1}
                                    />
                                ) )
                            ) : null
                        ) }
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div> );
}
