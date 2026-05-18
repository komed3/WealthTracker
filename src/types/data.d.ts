import type { ASSET_CLASS, COLOR, CONFIDENCE, CURRENCY, GENDER, ICON, LIABILITY_CLASS, LIQUIDITY } from '@/src/config/constants';
import type { resources } from '@/src/lib/i18n';

export interface DisplaySettings {
  language: keyof typeof resources;
  currency: CURRENCY;
  decimals: number;
}

export interface Profile {
  birthDate: string;
  gender: GENDER;
}

export interface Settings {
  display: DisplaySettings;
  profile: Profile;
}

interface BaseEntry {
  id: string;
  liquidity: LIQUIDITY;
  title: string;
  description?: string;
  icon: ICON;
  color: COLOR;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AssetEntry extends BaseEntry {
  category: 'asset';
  class: ASSET_CLASS;
}

export interface LiabilityEntry extends BaseEntry {
  category: 'liability';
  class: LIABILITY_CLASS;
}

export type Entry = AssetEntry | LiabilityEntry;

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
  history: Record< `${number}`, YearValue >;
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

export interface Growth {
  absolute: number;
  relative: number;
}

export interface YearSnapshot {
  year: number;
  assets: number;
  liabilities: number;
  netWorth: number;
  minNetWorth?: number;
  maxNetWorth?: number;
  growth?: Growth;
  byCategory: CategoryBreakdown;
  byLiquidity: LiquidityBreakdown;
  byClass: ClassBreakdown;
}

export interface EntryStats {
  entryId: string;
  firstYear: number;
  lastYear: number;
  latestValue: number;
  growth?: Growth;
  highestValue?: number;
  lowestValue?: number;
  averageValue?: number;
  averageAnnualGrowth?: number;
  volatility?: number;
}

export interface PortfolioStats {
  firstYear: number;
  lastYear: number;
  latestNetWorth: number;
  highestNetWorth?: number;
  lowestNetWorth?: number;
  totalGrowth?: Growth;
  averageAnnualGrowth?: number;
  bestYear?: number;
  worstYear?: number;
  averageLiquidity?: number;
  assetCount: number;
  liabilityCount: number;
  archivedCount: number;
}

export interface ComputedData {
  years: Record< `${number}`, YearSnapshot >;
  entries: Record< string, EntryStats >;
  portfolio: PortfolioStats;
}

export interface Data {
  settings: Settings;
  entries: EntryRecord[];
  computed: ComputedData;
  createdAt: string;
  updatedAt: string;
}
