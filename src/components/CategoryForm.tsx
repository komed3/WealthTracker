import { Plus, X, Wallet } from 'lucide-react';

import { Rubric, RUBRICS } from '../types';
import { cn } from '../utils';
import { ICON_MAP, AVAILABLE_ICONS } from '../constants/icons';

const COLORS = [
    '#0f172a', '#334155', '#64748b', '#ef4444', '#f97316', '#f59e0b',
    '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef'
];

export default function CategoryForm ( { form, setForm, t, newYear, setNewYear, newValue, setNewValue, onAddYear, onRemoveYear, onSave, onCancel }: any ) {
    return ( <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-400">{t.editor.categoryName}</label>
                <input
                    type="text"
                    value={ form.name || '' }
                    onChange={ e => setForm( { ...form, name: e.target.value } ) }
                    className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-900/10 focus:border-brand-900 transition-all"
                    placeholder={t.editor.categoryPlaceholder}
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-400">{t.editor.rubric}</label>
                <select
                    value={ form.rubric || 'liquid' }
                    onChange={ e => setForm( { ...form, rubric: e.target.value as Rubric } ) }
                    className="w-full px-4 py-3 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-900/10 focus:border-brand-900 transition-all bg-white"
                >{ Object.entries( RUBRICS ).map( ( [ key ]: [ any, any ] ) => (
                    <option key={key} value={key}>{ t.rubrics[ key ] }</option>
                ) ) }</select>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-400">{t.editor.color}</label>
                <div className="flex flex-wrap gap-2">
                    { COLORS.map( c => ( <button
                        key={c}
                        onClick={ () => setForm( { ...form, color: c } ) }
                        className={ cn(
                            'w-8 h-8 rounded-lg border-2 transition-all',
                            form.color === c ? 'border-brand-900 scale-110 shadow-md' : 'border-transparent'
                        ) }
                        style={ { backgroundColor: c } }
                    /> ) ) }
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-brand-400">{t.editor.icon}</label>
                <div className="flex flex-wrap gap-2">{ AVAILABLE_ICONS.map( iconName => {
                    const IconComp = ICON_MAP[ iconName ] || Wallet;

                    return ( <button
                        key={iconName}
                        onClick={ () => setForm( { ...form, icon: iconName } ) }
                        className={ cn(
                            'w-10 h-10 rounded-lg border-2 flex items-center justify-center transition-all',
                            form.icon === iconName ? 'border-brand-900 bg-brand-50 scale-110 shadow-md' : 'border-brand-100 text-brand-400'
                        ) }
                    ><IconComp size={20} /></button> );
                } ) }</div>
            </div>
        </div>

        <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-400">{t.editor.years}</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{ Object.entries( form.values || {} ).sort().map( ( [ year, val ]: [ any, any ] ) => (
                <div key={year} className="flex items-center justify-between bg-brand-50 px-4 py-2 rounded-xl border border-brand-100">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-brand-400">{year}</span>
                        <span className="font-mono text-sm font-medium">{ val.toLocaleString() }</span>
                    </div>
                    <button onClick={ () => onRemoveYear( year ) } className="text-brand-300 hover:text-red-500 transition-colors">
                        <X size={14} />
                    </button>
                </div>
            ) ) }</div>

            <div className="flex gap-3 items-end bg-brand-50/50 p-4 rounded-xl border border-brand-100 border-dashed">
                <div className="flex-1 space-y-1">
                    <span className="text-[10px] font-bold text-brand-400 uppercase">{t.common.year}</span>
                    <input
                        type="number"
                        value={newYear}
                        onChange={ e => setNewYear( e.target.value ) }
                        className="w-full px-3 py-2 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-900/10"
                        placeholder="2024"
                    />
                </div>
                <div className="flex-1 space-y-1">
                    <span className="text-[10px] font-bold text-brand-400 uppercase">{t.common.value}</span>
                    <input
                        type="number"
                        value={newValue}
                        onChange={ e => setNewValue( e.target.value ) }
                        className="w-full px-3 py-2 rounded-lg border border-brand-200 focus:outline-none focus:ring-2 focus:ring-brand-900/10"
                        placeholder="5000"
                    />
                </div>
                <button
                    onClick={onAddYear}
                    className="bg-white border border-brand-200 text-brand-900 p-2.5 rounded-lg hover:bg-brand-100 transition-colors shadow-sm"
                ><Plus size={20} /></button>
            </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-brand-100">
            <button onClick={onCancel} className="px-6 py-3 rounded-xl text-brand-500 hover:bg-brand-50 transition-colors font-medium">
                {t.editor.cancel}
            </button>
            <button onClick={onSave} className="bg-brand-900 text-white px-8 py-3 rounded-xl hover:bg-brand-800 transition-all shadow-lg shadow-brand-900/10 font-medium">
                {t.editor.save}
            </button>
        </div>
    </div> );
}
