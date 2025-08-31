export const tradeJournalValidationRules = {
  scriptName: {
    required: true,
    message: "Script Name is required",
  },
  buyDate: {
    required: true,
    message: "Date is required",
  },
  strategyName: {
    required: true,
    message: "Strategy Name is required",
  },
  entryPrice: {
    required: true,
    type: "number",
    message: "Entry Price is required",
  },
  slPrice: {
    required: true,
    type: "number",
    message: "Stop Loss is required",
  },
  targetPrice: {
    required: true,
    type: "number",
    message: "Target Price is required",
  },
  exitPrice: {
    required: true,
    type: "number",
    message: "Exit Price is required",
  },
  quantity: {
    required: true,
    type: "number",
    message: "Qty is required",
  },
  profitLossPrice: {
    required: true,
    type: "number",
    message: "Profit/Loss is required",
  },
  emotionsWhenEnter: {
    required: true,
    message: "Entry Emotion is required",
  },
  emotionsWhenExit: {
    required: true,
    message: "Exit Emotion is required",
  },
  broker: {
    required: true,
    message: "Broker is required",
  },
  dematUser: {
    required: true,
    message: "Account is required",
  },
  trade_type: {
    required: true,
    message: "Trade Type is required",
  },
  rating: {
    required: true,
    type: "number",
    message: "Rating must be within 0 to 5",
    min: 0,
    max: 5,
  },
  learning: {
    required: false,
    message: "Learning is required",
  },
  mistake: {
    required: false,
    message: "Mistake is required",
  },
};

export const watchlistValidationRules = {
  created_at: {
    required: true,
    message: "Date is required",
  },
  scriptName: {
    required: true,
    message: "Script Name is required",
  },
  strategyName: {
    required: true,
    message: "Strategy Name is required",
  },
  stockPrice: {
    required: true,
    type: "number",
    message: "Stock Price is required",
  },
  status: {
    required: true,
    message: "Status is required",
  },
};

export const customBrokerValidationRules = {
  label: {
    required: true,
    message: "Broker Name is required",
  },
};

export const strategyValidationRules = {
  strategy_name: {
    required: true,
    message: "Strategy is required",
  },
  strategy_type: {
    required: true,
    message: "Strategy Type is required",
  },
  entry_criteria: {
    required: true,
    message: "Entry Criteria is required",
  },
  exit_criteria: {
    required: true,
    message: "Exit Criteria is required",
  },
};

export const dematAccountValidationRules = {
  label: {
    required: true,
    message: "Demat Account is required",
  },
};

export const brokerAccountValidationRules = {
  label: {
    required: true,
    message: "Broker is required",
  },
};

export const loginValidationRules = {
  email: {
    required: true,
    message: "Please enter a valid email address.",
    type: "email",
  },
  password: {
    required: true,
    minLength: 6,
    message: "Password is required and must be at least 6 characters long",
  },
};

export const signupValidationRules = {
  ...loginValidationRules,
  name: {
    required: true,
    message: "Name is required.",
  },
  mobile: {
    required: true,
    minLength: 10,
    maxLength: 10,
    type: "number",
    message: "Mobile Number is Required",
  },
};

export const resetPasswordValidationRules = {
  email: {
    required: true,
    message: "Please enter a valid email address.",
    type: "email",
  },
};

export const contactValidationRules = {
  message: {
    required: true,
    message: "Message is required",
  },
};

export const reportConsoleValidationRules = {
  report_type: {
    required: true,
    message: "Report Type is required",
  },
  from_date: {
    required: true,
    message: "From Date is required",
  },
  to_date: {
    required: true,
    message: "To Date is required",
  },
};
