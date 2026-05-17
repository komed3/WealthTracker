import type { CLASS, COLOR, CURRENCY, ICON, LIQUIDITY } from '@/src/config/constants';
import type { resources } from '@/src/lib/i18n';

export interface AppSettings {
  language: keyof typeof resources;
  name: string;
  dateOfBirth: string;
  currency: CURRENCY;
  digits: number;
}

export interface AssetYear< K extends `${ number }` > {
  year: K;
  value: number;
  min?: number;
  max?: number;
  share: number;
}

export interface Asset {
  readonly id: string;
  name: string;
  description: string;
  liquidity: LIQUIDITY;
  class: CLASS;
  icon: ICON;
  color: COLOR;
  data: {
    [ K in `${ number }` ]: AssetYear< K >;
  };
}

export interface Data {
  settings: AppSettings;
  assets: Asset[];
}
