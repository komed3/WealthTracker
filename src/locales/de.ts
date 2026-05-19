export default ( {
  translation: {
    assetClass: {
      bank: 'Bankkonto',
      bonds: 'Anleihen',
      cash: 'Bargeld',
      collectibles: 'Sammlerstücke',
      commodities: 'Rohstoffe',
      crypto: 'Kryptowährungen',
      etf: 'ETFs',
      funds: 'Fonds',
      insurance: 'Versicherungen',
      lending: 'Darlehen (vergeben)',
      luxury: 'Luxusgüter',
      moneyMarket: 'Geldmarkt',
      other: 'Sonstiges',
      pension: 'Altersvorsorge',
      privateEquity: 'Private Equity',
      realEstate: 'Immobilien',
      stocks: 'Aktien',
      vehicles: 'Fahrzeuge',
      wallet: 'Wallet'
    },
    category: {
      asset: 'Vermögenswert',
      liability: 'Verbindlichkeit'
    },
    confidence: {
      high: 'Hoch',
      low: 'Niedrig',
      medium: 'Mittel'
    },
    currencies: {
      AED: 'Dirham (AED)',
      AUD: 'Australischer Dollar (AUD)',
      CAD: 'Kanadischer Dollar (CAD)',
      CHF: 'Schweizer Franken (CHF)',
      CNY: 'Chinesischer Yuan (CNY)',
      CZK: 'Tschechische Krone (CZK)',
      DKK: 'Dänische Krone (DKK)',
      EUR: 'Euro (EUR)',
      GBP: 'Britisches Pfund (GBP)',
      HKD: 'Hongkong-Dollar (HKD)',
      HUF: 'Ungarischer Forint (HUF)',
      INR: 'Indische Rupie (INR)',
      JPY: 'Japanischer Yen (JPY)',
      NOK: 'Norwegische Krone (NOK)',
      NZD: 'Neuseeland-Dollar (NZD)',
      PLN: 'Polnischer Złoty (PLN)',
      SEK: 'Schwedische Krone (SEK)',
      SGD: 'Singapur-Dollar (SGD)',
      TRY: 'Türkische Lira (TRY)',
      USD: 'US-Dollar (USD)'
    },
    editor: {
      actions: 'Aktionen',
      archiveDescription: 'Diese Position ist nicht länger aktiv',
      archivePosition: 'Archivierte Position',
      addNewPosition: 'Neue Position',
      cancel: 'Abbrechen',
      category: 'Kategorie',
      class: 'Klasse',
      color: 'Farbe',
      dataPoints: 'Datenpunkte',
      deleteButton: 'Löschen',
      description: 'Verwalte deine finanziellen Positionen und deren historische Daten.',
      descriptionLabel: 'Beschreibung',
      descriptionPlaceholder: 'z.B. "Dies ist mein privates Sparkonto"',
      editButton: 'Bearbeiten',
      editPosition: 'Position bearbeiten',
      emptyList: 'Du hast noch keine Positionen hinzugefügt. Klicke auf "Neue Position", um loszulegen.',
      icon: 'Icon',
      liquidity: 'Liquidität',
      newPosition: 'Neue Position',
      positions: 'Positionen',
      positionTitle: 'Position / Vermögenswert',
      positionTitlePlaceholder: 'z.B. "Mein Haus" oder "Sparplan"',
      save: 'Speichern',
      status: 'Status',
      titel: 'Editor'
    },
    genders: {
      diverse: 'Divers',
      female: 'Weiblich',
      male: 'Männlich',
      unspecified: 'Keine Angabe'
    },
    languages: {
      de: 'Deutsch',
      en: 'Englisch'
    },
    liabilityClass: {
      creditCard: 'Kreditkarte',
      leasing: 'Leasing',
      loan: 'Kredit / Darlehen',
      mortgage: 'Hypothek',
      other: 'Sonstiges',
      tax: 'Steuerschulden'
    },
    liquidity: {
      1: 'Sofort verfügbar',
      2: 'Kurzfristig (1–6M)',
      3: 'Mittelfristig (6M–3J)',
      4: 'Langfristig (3–10J)',
      5: 'Illiquide (> 10J)'
    },
    nav: {
      assets: 'Vermögenswerte',
      breakdown: 'Aufschlüsselung',
      dashboard: 'Dashboard',
      editor: 'Editor',
      momentum: 'Wachstum',
      report: 'Bericht',
      stats: 'Statistiken'
    },
    settings: {
      birthDate: 'Geburtsdatum',
      currency: 'Standardwährung',
      decimals: 'Dezimalstellen',
      description: 'Verwalte dein Profil und deine Anzeige-Konfigurationen.',
      displayTitle: 'Anzeige-Einstellungen',
      gender: 'Geschlecht',
      language: 'Sprache',
      profileTitle: 'Persönliches Profil',
      save: 'Einstellungen speichern',
      savedSuccess: 'Einstellungen erfolgreich gespeichert!',
      title: 'Einstellungen'
    },
    sidebar: {
      collapse: 'Einklappen',
      expand: 'Aufklappen',
      settings: 'Einstellungen'
    },
    status: {
      active: 'Aktiv',
      archived: 'Archiviert'
    }
  }
} ) as const;
