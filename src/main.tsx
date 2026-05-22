import App from '@/src/App';
import '@/src/lib/i18n';
import '@/src/styles/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Suppress specific Recharts warning about zero values, which can occur during
 * initial render or with certain datasets
 */
const originalWarn = console.warn;
console.warn = ( ...args ) => {
  if ( typeof args[ 0 ] === 'string' && args[ 0 ].includes( 'of chart should be greater than 0' ) ) return;
  originalWarn( ...args );
};

createRoot( document.getElementById( 'root' )! ).render(
  <StrictMode>
    <App />
  </StrictMode>
);
