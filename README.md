# WealthTracker

**Self-hosted, multi-currency wealth tracking application for temporal financial analysis, portfolio breakdowns, and historic estate monitoring.**

WealthTracker is a lightweight, responsive web application that allows to record, evaluate, and forecast personal net worth. By factoring in asset ranges (to account for volatility/estimates), asset classes, and liquidity levels, the systems offers a feature-rich alternative to basic point-in-time spreadsheets.

The application features a React frontend styled with Tailwind CSS, a lightweight Express backend, and interactive visualizations powered by Recharts.

## Features

- **Interactive Charts**: Detailed charts showing your net worth journey over the years, mapping assets, liabilities, value ranges, and more.
- **Asset Details**: Dedicated sub-views for assets, including ranges, annual growth and calculated evaluation.
- **Portfolio Analytics**: Built-in mapping of historical year-over-year average growth, current asset-liability distributions, and global wealth percentile benchmarks.
- **Record Editor**: Seamless direct snapshot editing and record state manipulation right from the web interface.
- **Localization**: Native i18n support supporting both English (`en`) and German (`de`) locales, complete with localized numbers, units, and custom currency formats.

## Installation

Clone and navigate to the project directory:

```bash
git clone https://github.com/komed3/WealthTracker.git
cd WealthTracker
```

Install npm dependencies:

```bash
npm install
```

Build the react app:

```bash
npm run build
```

Run the server:

```bash
npm run start
```
