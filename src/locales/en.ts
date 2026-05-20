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
      add: 'Add',
      addNewPosition: 'New Position',
      archivePosition: 'Archived Position',
      cancel: 'Cancel',
      category: 'Category',
      class: 'Class',
      color: 'Color',
      confidence: 'Confidence',
      dataPointExistsAlert: 'A data point for this year already exists. Please edit the existing one if you want to make changes.',
      dataPoints: 'Data Points',
      deleteButton: 'Delete',
      deleteConfirm: 'Are you sure you want to delete this position? All associated data points will also be deleted. This action cannot be undone.',
      deleteDataPointConfirm: 'Are you sure you want to delete the data point for {{year}}? This action cannot be undone.',
      description: 'Manage your financial positions and their historical data.',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'e.g. "This is my private savings account"',
      editButton: 'Edit',
      editPosition: 'Edit Position',
      icon: 'Icon',
      liquidity: 'Liquidity',
      maximum: 'Maximum',
      minimum: 'Minimum',
      newPosition: 'New Position',
      noDataPoints: 'No data points added yet. Use the form above to add your first one.',
      note: 'Note',
      notePlaceholder: 'e.g. "This position has gained significant value in recent years ..."',
      notionalPosition: 'Notional position',
      positions: 'Positions',
      positionTitle: 'Position / Asset',
      positionTitlePlaceholder: 'e.g. "Savings Account"',
      save: 'Save',
      source: 'Source',
      sourcePlaceholder: 'e.g. "Bank statement, financial report, etc."',
      status: 'Status',
      title: 'Editor',
      value: 'Value',
      valuePlaceholder: 'e.g. 100.00',
      year: 'Year',
      yearPlaceholder: 'e.g. 2024'
    },
    genders: {
      diverse: 'Diverse',
      female: 'Female',
      male: 'Male',
      unspecified: 'Unspecified'
    },
    global: {
      noData: 'No data available. Please add a position in the editor to get started.',
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
    momentum: {
      absolute: 'Absolute',
      description: 'Analyze the momentum of your wealth growth over the years.',
      relative: 'Relative',
      title: 'Momentum'
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
