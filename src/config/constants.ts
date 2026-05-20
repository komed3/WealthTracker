export type CURRENCY = ( typeof CURRENCY )[ number ];
export const CURRENCY = [
  'USD', 'EUR', 'CHF', 'GBP', 'JPY', 'CNY', 'CAD', 'AUD',
  'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'SGD', 'HKD',
  'NZD', 'TRY', 'AED', 'INR'
] as const;

export type LIQUIDITY = ( typeof LIQUIDITY )[ number ];
export const LIQUIDITY = [
  1, // immediate (< 1 week)
  2, // short term (1 week - 6 months)
  3, // medium term (6 months - 3 years)
  4, // long term (3 - 10 years)
  5  // illiquid (> 10 years)
] as const;

export type CATEGORY = ( typeof CATEGORY )[ number ];
export const CATEGORY = [
  'asset', 'liability'
] as const;

export type ASSET_CLASS = ( typeof ASSET_CLASS )[ number ];
export const ASSET_CLASS = [
  'cash', 'bank', 'moneyMarket', 'stocks', 'etf', 'funds', 'bonds',
  'crypto', 'commodities', 'realEstate', 'pension', 'insurance',
  'collectibles', 'vehicles', 'luxury', 'lending', 'privateEquity',
  'other'
] as const;

export type LIABILITY_CLASS = ( typeof LIABILITY_CLASS )[ number ];
export const LIABILITY_CLASS = [
  'mortgage', 'loan', 'creditCard', 'tax', 'leasing', 'other'
] as const;

export const CLASS = [ ...ASSET_CLASS, ...LIABILITY_CLASS ] as const;
export type CLASS = ASSET_CLASS | LIABILITY_CLASS;

export const LIQUIDITY_DEFAULT: Record< ASSET_CLASS, LIQUIDITY > = {
  cash: 1, bank: 1, moneyMarket: 2, stocks: 2, etf: 2, funds: 3,
  bonds: 3, crypto: 2, commodities: 3, realEstate: 5, pension: 5,
  insurance: 4, collectibles: 4, vehicles: 3, luxury: 4,
  lending: 3, privateEquity: 5, other: 3
};

export type CONFIDENCE = ( typeof CONFIDENCE )[ number ];
export const CONFIDENCE = [
  'low', 'medium', 'high'
] as const;

export type ICON = ( typeof ICON )[ number ];
export const ICON = [
  'Wallet', 'WalletCards', 'Vault', 'PiggyBank', 'Landmark',
  'Coins', 'Bitcoin', 'Banknote', 'House', 'Car', 'Watch', 'Gem',
  'Trophy', 'Handbag', 'ChartCandlestick', 'ShieldCheck', 'Gift',
  'HeartHandshake', 'CreditCard', 'Building2', 'Briefcase',
  'TrendingUp', 'PieChart', 'Plane', 'Ship', 'Smartphone',
  'AlignHorizontalDistributeCenter', 'Archive', 'Asteroid',
  'Award', 'BadgeCheck', 'Barrel', 'Box', 'Castle', 'Scroll',
  'ChessKnight', 'ClockFading', 'Command', 'Component', 'Crown',
  'DollarSign', 'Euro', 'Factory', 'FileChartColumn', 'Frame',
  'HandCoins', 'LaptopMinimal', 'Medal', 'Origami', 'Palette',
  'Piano', 'Receipt', 'Sailboat', 'Scale', 'Rocket', 'Shirt',
  'ShieldHalf', 'Tractor', 'Trees', 'Volleyball', 'Image',
  'LandPlot', 'PenTool', 'BookOpenText'
] as const;

export type COLOR = ( typeof COLOR )[ number ];
export const COLOR = [
  '#64748b', '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#d4a373', '#bc6c25', '#606c38', '#a6912b', '#a3b18a',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
  '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#d946ef', '#e0bbe4', '#ec4899', '#f43f5e', '#a53f2b'
] as const;

export type GENDER = ( typeof GENDER )[ number ];
export const GENDER = [
  'male', 'female', 'diverse', 'unspecified'
] as const;
