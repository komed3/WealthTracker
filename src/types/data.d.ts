import type { CLASS, COLOR, CURRENCY, ICON } from '@/src/config/constants';
import type { resources } from '@/src/lib/i18n';

export interface AppSettings {
  language: keyof typeof resources;
  name: string;
  dateOfBirth: string;
  currency: CURRENCY;
  digits: number;
}

export interface AssetYear {
  value: number;
  min?: number;
  max?: number;
  share: number;
}

export interface Asset {
  readonly id: string;
  class: CLASS;
  name: string;
  description: string;
  icon: ICON;
  color: COLOR;
  data: Record< `${ number }`, AssetYear >;
}

export interface Data {
  settings: AppSettings;
  assets: Asset[];
}
