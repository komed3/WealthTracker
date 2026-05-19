import { ListTree, Settings2 } from 'lucide-react';
import { useState } from 'react';

import { Intro } from '@/src/components/ui/Intro';
import { Tabs } from '@/src/components/ui/Tabs';
import i18n from '@/src/lib/i18n';

export const Editor = () => {
  const [ activeTab, setActiveTab ] = useState( 'entries' );

  return ( <>
    <div className= 'flex justify-between items-center gap-8'>
      <Intro
        title= { i18n.t( $ => $.editor.title ) }
        description= { i18n.t( $ => $.editor.description ) }
      />
      <Tabs
        activeId= { activeTab }
        onChange= { id => setActiveTab( id ) }
        options={ [
          { id: 'entries', label: i18n.t( $ => $.editor.positions ), icon: <Settings2 size={ 16 } /> },
          { id: 'history', label: i18n.t( $ => $.editor.dataPoints ), icon: <ListTree size={ 16 } /> }
        ] }
      />
    </div>
  </> );
};
