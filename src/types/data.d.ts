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
  year: number;
  confidence: CONFIDENCE;
  value: number;
  min?: number;
  max?: number;
  source?: string;
  note?: string;
  updatedAt: string;
}

export interface EntryRecord {
  entry: Entry;
  history: Record< number, YearValue >;
}

export interface Breakdown {
  value: number;
  min?: number;
  max?: number;
  percentage: number;
  percentageMin?: number;
  percentageMax?: number;
}

export interface CategoryBreakdown {
  asset: Breakdown;
  liability: Breakdown;
}

export type LiquidityBreakdown = Partial< Record< LIQUIDITY, Breakdown > >;

export type ClassBreakdown = Partial< Record< CLASS, Breakdown > >;
