import { BrowserRouter, Route, Routes } from 'react-router';

import { MainLayout } from '@/src/components/layout/MainLayout';
import { DataProvider } from '@/src/context/DataCtx';
import { LayoutProvider } from '@/src/context/LayoutCtx';

import { AssetDetail } from '@/src/views/AssetDetail';
import { Assets } from '@/src/views/Assets';
import { Breakdown } from '@/src/views/Breakdown';
import { Dashboard } from '@/src/views/Dashboard';
import { Editor } from '@/src/views/Editor';
import { Momentum } from '@/src/views/Momentum';
import { Report } from '@/src/views/Report';
import { Settings } from '@/src/views/Settings';
import { Stats } from '@/src/views/Stats';

export default function App () {
  return (
    <DataProvider>
      <LayoutProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path= '/' element= { <Dashboard /> } />
              <Route path= '/momentum' element= { <Momentum /> } />
              <Route path= '/assets' element= { <Assets /> } />
              <Route path= '/asset/:assetId' element= { <AssetDetail /> } />
              <Route path= '/breakdown' element= { <Breakdown /> } />
              <Route path= '/report' element= { <Report /> } />
              <Route path= '/stats' element= { <Stats /> } />
              <Route path= '/editor' element= { <Editor /> } />
              <Route path= '/settings' element= { <Settings /> } />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </LayoutProvider>
    </DataProvider>
  );
}
