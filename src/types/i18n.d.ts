import type { resources } from '@/src/lib/i18n';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof resources[ 'en' ];
    enableSelector: true;
  }
}
