import type { Data, Settings } from './data';

export interface DataCtxType {
  loading: boolean;
  data: Data | null;
  settings: Settings | null;
  updateSettings: ( settings: Settings ) => Promise< boolean >;
  refreshData: () => Promise< void >;
}

export interface LayoutCtxType {
  sidebarOpen: boolean;
  setSidebarOpen: ( open: boolean ) => void;
  toggleSidebar: () => void;
  title: string;
  setTitle: ( title: string ) => void;
}
