import App from '@/src/App';
import '@/src/lib/i18n';
import '@/src/styles/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

createRoot( document.getElementById( 'root' )! ).render(
  <StrictMode>
    <App />
  </StrictMode>
);
