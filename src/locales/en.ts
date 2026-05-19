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
      actions: 'Actions',
      addNewPosition: 'New Position',
      archiveDescription: 'This position is not longer active',
      archivePosition: 'Archived Position',
      category: 'Category',
      class: 'Class',
      dataPoints: 'Data Points',
      deleteButton: 'Delete',
      description: 'Manage your financial positions and their historical data.',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'e.g. "This is my private savings account"',
      editButton: 'Edit',
      editPosition: 'Edit Position',
      emptyList: 'You haven’t added any positions yet. Click on "Add New Position" to get started.',
      liquidity: 'Liquidity',
      newPosition: 'New Position',
      positions: 'Positions',
      positionTitle: 'Position / Asset',
      positionTitlePlaceholder: 'e.g. "Savings Account"',
      status: 'Status',
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
      3: 'Medium-term (6M–3J)',
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
    },
    sidebar: {
      collapse: 'Collapse',
      expand: 'Expand',
      settings: 'Settings'
    },
    status: {
      active: 'Active',
      archived: 'Archived'
    }
  }
} ) as const;
