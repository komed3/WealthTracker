export const CURRENCY = [ 'EUR', 'USD', 'CHF' ] as const;
export type CURRENCY = ( typeof CURRENCY )[ number ];

export const LIQUIDITY = [ 1, 2, 3, 4, 5 ] as const;
export type LIQUIDITY = ( typeof LIQUIDITY )[ number ];

export const CLASS = [
  'cash', 'accounts', 'moneyMarket', 'stocks', 'funds',
  'bonds', 'interest', 'pension', 'realEstate', 'commodities',
  'tangibles', 'crypto', 'loans', 'other'
] as const;
export type CLASS = ( typeof CLASS )[ number ];

export const ICON = [
  'Wallet', 'WalletCards', 'Vault', 'PiggyBank', 'Landmark',
  'Coins', 'Bitcoin', 'Banknote', 'House', 'Car', 'Watch', 'Gem',
  'Trophy', 'Handbag', 'ChartCandlestick', 'ShieldCheck', 'Gift',
  'HeartHandshake', 'CreditCard', 'Building2', 'Briefcase',
  'TrendingUp', 'PieChart', 'Plane', 'Ship', 'Smartphone'
] as const;
export type ICON = ( typeof ICON )[ number ];

export const COLOR = [
  '#64748b', '#ef4444', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
  '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
  '#d946ef', '#ec4899', '#f43f5e', '#78716c', '#71717a',
] as const;
export type COLOR = ( typeof COLOR )[ number ];

