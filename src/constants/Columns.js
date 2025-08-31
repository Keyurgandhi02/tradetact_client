export const WATCHLIST_DROPDOWNS = [
  {
    id: "1",
    label: "Watch",
  },
  {
    id: "2",
    label: "Watch & Buy",
  },
  {
    id: "3",
    label: "Buy",
  },
  {
    id: "5",
    label: "Sell",
  },
  {
    id: "4",
    label: "Short",
  },
];

export const TRADE_TYPE_DROPDOWNS = [
  {
    id: 1,
    label: "Delivery",
  },
  {
    id: 2,
    label: "Intraday Buy (Cash)",
  },
  {
    id: 3,
    label: "Intraday Short (Cash)",
  },
  {
    id: 4,
    label: "Intraday Buy (Margin)",
  },
  {
    id: 5,
    label: "Intraday Short (Margin)",
  },
  {
    id: 6,
    label: "Carry Forward",
  },
  {
    id: 7,
    label: "Other",
  },
];

export const TRADE_ANALYSIS_DETAILS_COLUMNS = [
  "Month",
  "Total Trades",
  "Win Trades",
  "Loss Trades",
  "Win Ratio",
  "Loss Ratio",
  "Total Gain",
  "Total Bought",
  "Total Sold",
];

export const TRADE_ANALYSIS_USER_COLUMNS = [
  "User",
  ...TRADE_ANALYSIS_DETAILS_COLUMNS,
];

export const TRADE_FILTERS_DROPDOWNS = [
  {
    id: 1,
    label: "All",
  },
  {
    id: 2,
    label: "Gain",
  },
  {
    id: 3,
    label: "Loss",
  },
];

export const TRADE_TIME_INTERVAL_DROPDOWNS = [
  {
    id: 1,
    label: "3 Min",
  },
  {
    id: 2,
    label: "5 Min",
  },
  {
    id: 3,
    label: "10 Min",
  },
  {
    id: 4,
    label: "15 Min",
  },
  {
    id: 5,
    label: "30 Min",
  },
  {
    id: 6,
    label: "Hourly",
  },
  {
    id: 7,
    label: "Daily",
  },
  {
    id: 8,
    label: "Weekely",
  },
  {
    id: 9,
    label: "Monthly",
  },
];

export const TRADE_ANALYSIS_DETAILS_CONSOLE_COLUMNS = [
  "Date",
  "Script",
  "Trade Type",
  "Entry",
  "Exit",
  "Overall G/L",
];

export const INDICATORS = [
  {
    id: 1,
    label: "Moving Average",
  },
  {
    id: 2,
    label: "RSI",
  },
  {
    id: 3,
    label: "MACD",
  },
  {
    id: 4,
    label: "Bollinger Bands",
  },
  {
    id: 5,
    label: "VWAP",
  },
  {
    id: 6,
    label: "Supertrend",
  },
  {
    id: 7,
    label: "Price Action",
  },
  {
    id: 8,
    label: "Other",
  },
];

export const STRATEGY_TYPE_DROPDOWNS = [
  {
    id: 1,
    label: "Day Trading",
  },
  {
    id: 2,
    label: "Swing Trading",
  },
  {
    id: 3,
    label: "Scalping",
  },
  {
    id: 4,
    label: "Position",
  },
  {
    id: 5,
    label: "Options",
  },
  {
    id: 6,
    label: "Futures",
  },
  {
    id: 7,
    label: "Other",
  },
];
