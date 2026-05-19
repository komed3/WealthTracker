export default ( {
  translation: {
    assetClass: {
      bank: 'Bank Account',
      bonds: 'Bonds',
      cash: 'Cash',
      collectibles: 'Collectibles',
      commodities: 'Commodities',
      crypto: 'Cryptocurrency',
      etf: 'ETFs',
      funds: 'Funds',
      insurance: 'Insurance',
      lending: 'Lending',
      luxury: 'Luxury Goods',
      moneyMarket: 'Money Market',
      other: 'Other',
      pension: 'Pension',
      privateEquity: 'Private Equity',
      realEstate: 'Real Estate',
      stocks: 'Stocks',
      vehicles: 'Vehicles',
      wallet: 'Wallet'
    },
    category: {
      asset: 'Asset',
      liability: 'Liability'
    },
    confidence: {
      high: 'High',
      low: 'Low',
      medium: 'Medium'
    },
    currencies: {
      AED: 'Dirham (AED)',
      AUD: 'Australian Dollar (AUD)',
      CAD: 'Canadian Dollar (CAD)',
      CHF: 'Swiss Franc (CHF)',
      CNY: 'Chinese Yuan (CNY)',
      CZK: 'Czech Koruna (CZK)',
      DKK: 'Danish Krone (DKK)',
      EUR: 'Euro (EUR)',
      GBP: 'British Pound (GBP)',
      HKD: 'Hong Kong Dollar (HKD)',
      HUF: 'Hungarian Forint (HUF)',
      INR: 'Indian Rupee (INR)',
      JPY: 'Japanese Yen (JPY)',
      NOK: 'Norwegian Krone (NOK)',
      NZD: 'New Zealand Dollar (NZD)',
      PLN: 'Polish Złoty (PLN)',
      SEK: 'Swedish Krona (SEK)',
      SGD: 'Singapore Dollar (SGD)',
      TRY: 'Turkish Lira (TRY)',
      USD: 'US Dollar (USD)'
    },
    editor: {
      dataPoints: 'Data Points',
      description: 'Configure your assets, liabilities and historical data points.',
      positions: 'Positions',
      title: 'Editor'
    },
    genders: {
      diverse: 'Diverse',
      female: 'Female',
      male: 'Male',
      unspecified: 'Unspecified'
    },
    languages: {
      de: 'German',
      en: 'English'
    },
    liabilityClass: {
      creditCard: 'Credit Card',
      leasing: 'Leasing',
      loan: 'Loan',
      mortgage: 'Mortgage',
      other: 'Other',
      tax: 'Tax Liability'
    },
    liquidity: {
      1: 'Immediate (< 1 week)',
      2: 'Short-term (1–6M)',
      3: 'Medium-term (6M–3Y)',
      4: 'Long-term (3–10Y)',
      5: 'Illiquid (> 10Y)'
    },
    nav: {
      assets: 'Assets',
      breakdown: 'Breakdown',
      dashboard: 'Dashboard',
      editor: 'Editor',
      momentum: 'Momentum',
      report: 'Report',
      stats: 'Statistics'
    },
    sidebar: {
      collapse: 'Collapse',
      expand: 'Expand',
      settings: 'Settings'
    },
    settings: {
      birthDate: 'Date of Birth',
      currency: 'Default Currency',
      decimals: 'Decimal Places',
      description: 'Manage your profile and display configurations.',
      displayTitle: 'Display Settings',
      gender: 'Gender',
      language: 'Language',
      profileTitle: 'Personal Profile',
      save: 'Save Settings',
      savedSuccess: 'Settings saved successfully!',
      title: 'Settings'
    }
  }
} ) as const;
