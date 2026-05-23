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
import { useEffect, useState } from 'react';
import { useLayout } from '../context/LayoutCtx';
import { uuid } from '../lib/utils';

export const Editor = () => {
  const { settings, data, updateEntries } = useData();
  const { setTitle } = useLayout();

  useEffect( () => { setTitle( i18n.t( $ => $.editor.title ) ) }, [ setTitle, settings?.display.language ] );

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

    if ( entryData.id ) {
      updatedEntries = entries.map( record => {
        if ( record.entry.id === entryData.id ) {
          const updatedEntry: Entry = {
            ...record.entry,
            title: entryData.title,
            description: entryData.description,
            category: entryData.category,
            class: entryData.class,
            liquidity: entryData.liquidity,
            archived: entryData.archived ?? false,
            notional: entryData.notional ?? false,
            color: entryData.color,
            icon: entryData.icon,
            updatedAt: new Date().toISOString()
          } as Entry;

          return { ...record, entry: updatedEntry };
        }

        return record;
      } );
    } else {
      const newEntry: Entry = {
        id: uuid(),
        title: entryData.title,
        description: entryData.description,
        category: entryData.category,
        class: entryData.class,
        liquidity: entryData.liquidity,
        archived: entryData.archived ?? false,
        notional: entryData.notional ?? false,
        color: entryData.color,
        icon: entryData.icon,
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

  return (
    <div className= 'flex-1 flex flex-col space-y-8'>
      { /** Page Header */ }
      <Intro
        title= { i18n.t( $ => $.editor.title ) }
        description= { i18n.t( $ => $.editor.description ) }
      >
        { entries.length > 0 && <Tabs
          activeId= { activeTab }
          onChange= { id => setActiveTab( id ) }
          options= { [
            { id: 'entries', label: i18n.t( $ => $.editor.positions ), icon: Settings2 },
            { id: 'history', label: i18n.t( $ => $.editor.dataPoints ), icon: ListTree }
          ] }
        /> }
      </Intro>

      { /** Tab Content */ }
      <div className= 'flex-1 flex flex-col w-full transition-all duration-300'>
        { activeTab === 'entries' ? (
          <div className= 'flex-1 flex flex-col gap-6'>
            <div className= 'flex justify-end'>
              <Button
                variant= 'primary'
                onClick= { handleCreateEntry }
              >
                <Plus size= { 18 } />
                { i18n.t( $ => $.editor.addNewPosition ) }
              </Button>
            </div>
            <PositionList
              entries= { entries }
              onEdit= { handleEditEntry }
              onDelete= { handleDeleteEntry }
            />
          </div>
        ) : (
          <DataPointsEditor
            entries= { entries }
            onUpdateHistory= { handleUpdateHistory }
            setActiveTab= { setActiveTab }
          />
        ) }
      </div>

      { /** Modal Overlay Form */ }
      <PositionModal
        isOpen= { isModalOpen }
        onClose= { () => {
          setIsModalOpen( false );
          setEditingEntry( null );
        } }
        onSave= { handleSaveEntry }
        initialEntry= { editingEntry }
      />
    </div>
  );
};
