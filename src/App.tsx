import { BrowserRouter, Route, Routes } from 'react-router';
import { MainLayout } from './components/layout/MainLayout';
import { LayoutProvider } from './context/LayoutCtx';
import { AssetDetail } from './views/AssetDetail';
import { Assets } from './views/Assets';
import { Breakdown } from './views/Breakdown';
import { Dashboard } from './views/Dashboard';
import { Editor } from './views/Editor';
import { Momentum } from './views/Momentum';
import { Report } from './views/Report';
import { Stats } from './views/Stats';

export default function App () {
  return (
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
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </LayoutProvider>
  );
}
