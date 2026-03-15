import { clsx, type ClassValue } from 'clsx';
import { LayoutDashboard, TrendingUp, PieChart, ClipboardList, BarChart3, BookOpen, Cpu, Gem, Settings2, ChevronRight, Globe, Coins } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { AppData, CURRENCIES, LANGUAGES } from './types';
import { cn } from './utils';

import Allocation from './views/Allocation';
import Editor from './views/Editor';
import Insight from './views/Insight';
import Inventory from './views/Inventory';
import Momentum from './views/Momentum';
import Snapshot from './views/Snapshot';
import Tangibles from './views/Tangibles';


const NavItem = ( { to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean } ) => (
    <Link to={to} className={ cn(
        'flex items-center gap-3 px-4 py-3 sidebar-rounded transition-all duration-200 group',
        active ? 'bg-white shadow-sm text-brand-900 font-medium' : 'text-brand-500 hover:bg-white/50 hover:text-brand-700'
    ) } >
        <Icon size={20} className={ cn( 'transition-colors', active ? 'text-brand-900' : 'text-brand-400 group-hover:text-brand-600' ) } />
        <span className="text-sm">{label}</span>
        { active && <ChevronRight size={14} className="ml-auto text-brand-300" /> }
    </Link>
);

const Sidebar = ( { data, t, onUpdateSettings }: { data: AppData | null, t: any, onUpdateSettings: ( s: any ) => void } ) => {
    const location = useLocation();

    return ( <aside className="w-72 border-r border-brand-200 h-screen flex flex-col bg-brand-100/50 backdrop-blur-xl sticky top-0">
        <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-brand-900 sidebar-rounded flex items-center justify-center text-white shadow-lg shadow-brand-900/20">
                    <TrendingUp size={24} />
                </div>
                <div><h1 className="font-bold text-lg tracking-tight">WealthTracker</h1></div>
            </div>

            <nav className="space-y-1">
                <NavItem to="/" icon={LayoutDashboard} label={t.nav.snapshot} active={ location.pathname === '/' } />
                <NavItem to="/momentum" icon={TrendingUp} label={t.nav.momentum} active={ location.pathname === '/momentum' } />
                <NavItem to="/allocation" icon={PieChart} label={t.nav.allocation} active={ location.pathname === '/allocation' } />
                <NavItem to="/inventory" icon={ClipboardList} label={t.nav.inventory} active={ location.pathname === '/inventory' } />
                <NavItem to="/analysis" icon={BarChart3} label={t.nav.analysis} active={ location.pathname === '/analysis' } />
                <NavItem to="/narrative" icon={BookOpen} label={t.nav.narrative} active={ location.pathname === '/narrative' } />
                <NavItem to="/strategy" icon={Cpu} label={t.nav.strategy} active={ location.pathname === '/strategy' } />
                <NavItem to="/tangibles" icon={Gem} label={t.nav.tangibles} active={ location.pathname === '/tangibles' } />
                <div className="pt-4 mt-4 border-t border-brand-200">
                    <NavItem to="/editor" icon={Settings2} label={t.nav.editor} active={ location.pathname === '/editor' } />
                </div>
            </nav>
        </div>

        <div className="mt-auto p-8 space-y-4">
            <div className="space-y-3 bg-white/50 p-4 rounded-xl border border-brand-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-brand-400 uppercase">
                        <Globe size={12} /> {t.common.language}
                    </div>
                    <select
                        value={data?.settings.language}
                        onChange={ ( e ) => onUpdateSettings( { ...data?.settings, language: e.target.value } ) }
                        className="text-xs font-semibold bg-transparent border-none focus:ring-0 p-0 text-brand-900"
                    >{ LANGUAGES.map( l => <option key={l} value={l}>{ l.toUpperCase() }</option> ) }</select>
                </div>
                <div className="h-px bg-brand-200" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-brand-400 uppercase">
                        <Coins size={12} /> {t.common.currency}
                    </div>
                    <select
                        value={data?.settings.currency}
                        onChange={ ( e ) => onUpdateSettings( { ...data?.settings, currency: e.target.value } ) }
                        className="text-xs font-semibold bg-transparent border-none focus:ring-0 p-0 text-brand-900"
                    >{ CURRENCIES.map( c => <option key={c} value={c}>{c}</option> ) }</select>
                </div>
            </div>
        </div>
    </aside> );
};
