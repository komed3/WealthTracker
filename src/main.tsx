import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/src/lib/i18n';
import '@/src/styles/index.css';

import App from '@/src/App';

createRoot( document.getElementById( 'root' )! ).render(
  <StrictMode>
    <App />
  </StrictMode>
);
