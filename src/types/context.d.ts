import type { Data, Settings } from '@/src/types/data';

export interface DataCtxType {
  loading: boolean;
  data: Data | null;
  settings: Settings | null;
  updateSettings: ( settings: Settings ) => Promise< boolean >;
  updateEntries: ( entries: EntryRecord[] ) => Promise< boolean >;
  refreshData: () => Promise< void >;
}

export interface LayoutCtxType {
  title: string;
  setTitle: ( title: string ) => void;
  loading: boolean;
  setLoading: ( loading: boolean ) => void;
  toggleSidebar: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: ( open: boolean ) => void;
}
