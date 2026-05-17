import { BrowserRouter, Route, Routes } from 'react-router';
import { MainLayout } from './components/layout/MainLayout';
import { LayoutProvider } from './context/LayoutCtx';
import { Dashboard } from './views/Dashboard';

export default function App () {
  return (
    <LayoutProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path= '/' element= { < Dashboard /> } />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </LayoutProvider>
  );
}
