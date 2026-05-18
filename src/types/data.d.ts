import type { CATEGORY, CLASS, COLOR, CONFIDENCE, CURRENCY, ICON, LIQUIDITY } from '@/src/config/constants';
import type { resources } from '@/src/lib/i18n';

export interface AppSettings {
  language: keyof typeof resources;
  name: string;
  dateOfBirth: string;
  currency: CURRENCY;
  digits: number;
}

export interface Entry {
  id: string;
  category: CATEGORY;
  class: CLASS;
  liquidity: LIQUIDITY;
  title: string;
  description?: string;
  icon: ICON;
  color: COLOR;
  archived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface YearValue {
  year: Year;
  value: Amount;
  min?: Amount;
  max?: Amount;
  confidence?: CONFIDENCE;
  note?: string;
  updatedAt: string;
}
