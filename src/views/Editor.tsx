import { DataPointsEditor } from '@/src/components/editor/DataPointsEditor';
import { PositionList } from '@/src/components/editor/PositionList';
import { PositionModal } from '@/src/components/editor/PositionModal';
import { Button } from '@/src/components/ui/Button';
import { Intro } from '@/src/components/ui/Intro';
import { Tabs } from '@/src/components/ui/Tabs';
import { useData } from '@/src/context/DataCtx';
import i18n from '@/src/lib/i18n';
import type { Entry, EntryRecord, YearValue } from '@/src/types/data';
import { ListTree, Plus, Settings2 } from 'lucide-react';
import { useState } from 'react';
import { uuid } from '../lib/utils';

export const Editor = () => {
  const { data, updateEntries } = useData();

  const [ activeTab, setActiveTab ] = useState( 'entries' );
  const [ isModalOpen, setIsModalOpen ] = useState( false );
  const [ editingEntry, setEditingEntry ] = useState < Entry | null > ( null );

  const entries = data?.entries || [];

  const handleCreateEntry = () => {
    setEditingEntry( null );
    setIsModalOpen( true );
  };

  const handleEditEntry = ( entry: Entry ) => {
    setEditingEntry( entry );
    setIsModalOpen( true );
  };

  const handleDeleteEntry = async ( id: string ) => {
    const entryRecord = entries.find( r => r.entry.id === id );
    if ( ! entryRecord ) return;

    const confirmMsg = i18n.t( $ => $.editor.deleteConfirm, { title: entryRecord.entry.title } );
    if ( ! window.confirm( confirmMsg ) ) return;

    const updatedEntries = entries.filter( r => r.entry.id !== id );
    await updateEntries( updatedEntries );
  };

  const handleSaveEntry = async ( entryData: Omit< Entry, 'id' | 'createdAt' | 'updatedAt' > & { id?: string } ) => {
    let updatedEntries: EntryRecord[];

    if ( entryData.id ) updatedEntries = entries.map( record => {
      if ( record.entry.id === entryData.id ) {
        const updatedEntry: Entry = {
          ...record.entry,
          title: entryData.title,
          description: entryData.description,
          category: entryData.category,
          class: entryData.class,
          liquidity: entryData.liquidity,
          color: entryData.color,
          icon: entryData.icon,
          archived: entryData.archived ?? false,
          updatedAt: new Date().toISOString()
        } as Entry;

        return { ...record, entry: updatedEntry };
      }

      return record;
    } );

    else {
      const newEntry: Entry = {
        id: uuid(),
        title: entryData.title,
        description: entryData.description,
        category: entryData.category,
        class: entryData.class,
        liquidity: entryData.liquidity,
        color: entryData.color,
        icon: entryData.icon,
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Entry;

      const newRecord: EntryRecord = { entry: newEntry, history: {} };
      updatedEntries = [ ...entries, newRecord ];
    }

    const success = await updateEntries( updatedEntries );
    if ( success ) {
      setIsModalOpen( false );
      setEditingEntry( null );
    }
  };

  const handleUpdateHistory = async ( entryId: string, newHistory: Record< string, YearValue > ) => {
    const updatedEntries = entries.map( record => {
      if ( record.entry.id === entryId ) return { ...record, history: newHistory };
      return record;
    } );

    await updateEntries( updatedEntries );
  };

  const tabs = [
    { id: 'entries', label: i18n.t( $ => $.editor.positions ), icon: Settings2 },
    { id: 'history', label: i18n.t( $ => $.editor.dataPoints ), icon: ListTree }
  ];

  if ( entries.length === 0 ) tabs.pop();

  return (
    <div className= 'space-y-8'>
      { /** Page Header nested with tabs */ }
      <Intro
        title= { i18n.t( $ => $.editor.title ) }
        description= { i18n.t( $ => $.editor.description ) }
      >
        <div className= 'flex justify-between md:justify-start items-center gap-3 w-full md:w-auto'>
          <Tabs
            activeId= { activeTab }
            onChange= { id => setActiveTab( id ) }
            options={ tabs }
          />
        </div>
      </Intro>
    </div>
  );
};
