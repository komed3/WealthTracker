import { Plus, Trash2, Edit2, Wallet } from 'lucide-react';
import { useState } from 'react';

import { AppData, Category, EditorProps } from '../types';
import { COLORS } from '../constants/colors';
import { ICON_MAP } from '../constants/icons';

import CategoryForm from '../components/CategoryForm';
import PageHeader from '../components/PageHeader';


export default function Editor( { data, t, onUpdate }: EditorProps ) {
    const [ editingId, setEditingId ] = useState< string | null >( null );
    const [ editForm, setEditForm ] = useState< Partial< Category > >( {} );
    const [ newYear, setNewYear ] = useState( '' );
    const [ newValue, setNewValue ] = useState( '' );

    const handleSaveData = async ( newData: AppData ) => {
        await fetch( '/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( newData )
        } );
        onUpdate();
    };

    const startEdit = ( cat: Category ) => {
        setEditingId( cat.id );
        setEditForm( { ...cat } );
    };

    const cancelEdit = () => {
        setEditingId( null );
        setEditForm( {} );
        setNewYear( '' );
        setNewValue( '' );
    };

    const saveEdit = async () => {
        if ( ! editForm.name || ! editForm.rubric ) return;

        const newCategories = editingId === 'new'
            ? [ ...data.categories, {
                ...editForm,
                id: crypto.randomUUID(),
                color: editForm.color || COLORS[ Math.floor( Math.random() * COLORS.length ) ],
                icon: editForm.icon || 'Wallet'
            } as Category ]
            : data.categories.map(
                c => c.id === editingId ? { ...c, ...editForm } as Category : c
            );

        await handleSaveData( { ...data, categories: newCategories } );
        cancelEdit();
    };

    const deleteCategory = async ( id: string ) => {
        if ( ! confirm( 'Are you sure?' ) ) return;
        const newCategories = data.categories.filter( c => c.id !== id );
        await handleSaveData( { ...data, categories: newCategories } );
    };

    const addYearValue = () => {
        if ( ! newYear || isNaN( Number( newValue ) ) ) return;
        setEditForm( { ...editForm, values: { ...editForm.values, [ newYear ]: Number( newValue ) } } );
        setNewYear( '' );
        setNewValue( '' );
    };

    const removeYear = ( year: string ) => {
        const newValues = { ...editForm.values };
        delete newValues[ year ];
        setEditForm( { ...editForm, values: newValues } );
    };

    return ( <div className="p-6 md:p-10 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-between items-end mb-8">
            <PageHeader title={t.editor.title} />
            <button
                onClick={ () => startEdit( { id: 'new', name: '', rubric: 'liquid', values: {}, color: COLORS[ 0 ], icon: 'Wallet' } ) }
                className="flex items-center gap-2 bg-brand-900 text-white px-6 py-3 rounded-lg hover:bg-brand-800 transition-all shadow-lg shadow-brand-900/20 font-medium"
            >
                <Plus size={20} />
                {t.editor.addCategory}
            </button>
        </div>

        <div className="space-y-6">{ data.categories.length === 0 && ! editingId && (
            <div className="text-center py-20 bg-white rounded-lg border border-dashed border-brand-200 text-brand-400">
                {t.editor.noCategories}
            </div>
        ) }

            { editingId === 'new' && ( <div className="bg-white p-8 rounded-lg border-2 border-brand-900 shadow-xl animate-in zoom-in-95 duration-200">
                <h3 className="text-xl font-semibold mb-6">{t.editor.addCategory}</h3>
                <CategoryForm
                    form={editForm}
                    setForm={setEditForm}
                    t={t}
                    lang={data.settings.language}
                    newYear={newYear}
                    setNewYear={setNewYear}
                    newValue={newValue}
                    setNewValue={setNewValue}
                    onAddYear={addYearValue}
                    onRemoveYear={removeYear}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                />
            </div> ) }

            { data.categories.map( cat => {
                const IconComp = ICON_MAP[ cat.icon || 'Wallet' ] || Wallet;

                return ( <div key={cat.id} className="bg-white rounded-lg border border-brand-200 shadow-sm overflow-hidden transition-all hover:shadow-md">
                    { editingId === cat.id ? ( <div className="p-8">
                        <CategoryForm
                            form={editForm}
                            setForm={setEditForm}
                            t={t}
                            lang={data.settings.language}
                            newYear={newYear}
                            setNewYear={setNewYear}
                            newValue={newValue}
                            setNewValue={setNewValue}
                            onAddYear={addYearValue}
                            onRemoveYear={removeYear}
                            onSave={saveEdit}
                            onCancel={cancelEdit}
                        />
                    </div> ) : ( <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                                style={ { backgroundColor: cat.color } }
                            ><IconComp size={24} /></div>
                            <div>
                                <h4 className="font-semibold text-lg text-brand-900">{cat.name}</h4>
                                <p className="text-sm text-brand-400">{ t.rubrics[ cat.rubric ] }</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <p className="text-[10px] uppercase tracking-widest text-brand-400 font-bold mb-1">{t.common.latestValue}</p>
                                <p className="font-mono font-medium text-brand-900">
                                    { Object.values(cat.values ).length > 0
                                        ? Object.values( cat.values )[ Object.values( cat.values ).length - 1 ].toLocaleString( undefined, { minimumFractionDigits: 2 } )
                                        : '0.00'
                                    } {data.settings.currency}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={ () => startEdit( cat ) }
                                    className="p-2 hover:bg-brand-50 rounded-lg text-brand-400 hover:text-brand-900 transition-colors"
                                ><Edit2 size={18} /></button>
                                <button
                                    onClick={ () => deleteCategory( cat.id ) }
                                    className="p-2 hover:bg-red-50 rounded-lg text-brand-400 hover:text-red-600 transition-colors"
                                ><Trash2 size={18} /></button>
                            </div>
                        </div>
                    </div> ) }
                </div> );
            } ) }
        </div>
    </div> );
}
