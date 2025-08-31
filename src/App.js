import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthenticatedLayout from "./components/AuthenticatedLayout";
import ProtectedRoute from "./utils/ProtectedRoute";
import {
  BROKER_ROUTES,
  CONSOLE_ROUTES,
  CONTACT_US_ROUTES,
  GENERAL_ROUTES,
  PRICING_ROUTES,
  RISK_MANAGE_ROUTES,
  RISK_ROUTES,
  TRADE_JOURNAL_ROUTES,
  TRADING_STRATEGY_ROUTES,
  USER_PROFILE_ROUTES,
  USER_ROUTES,
  WATCHLIST_ROUTES,
} from "./constants/routesConstants";
import {
  HomePage,
  NotFound404Page,
  ProfilePage,
  ResetPasswordPage,
  RegisterPage,
  RiskManagementPage,
  ContactPage,
  WatchlistPage,
  CreateEditWatchlistPage,
  TradeJournalPage,
  CreateEditTradeJournalPage,
  CreateEditTradingStrategyPage,
  TradingStrategyPage,
  ManageBrokerDematAccountsPage,
  CreateEditBrokerDematAccountsPage,
  PricingPage,
  PricingCheckoutPage,
  ConsoleDashPage,
  ConsoleReportsPage,
  ConsoleTradesPage,
  ConsoleAnalysisPage,
  ManageRiskManagementPage,
} from "./pages/index";
import HomeIndexPage from "./pages/home/HomeIndexPage";
import { useAuth } from "./context/AuthContext";
import OnboardingPage from "./pages/OnboardingPage";

function App() {
  const { currentUser } = useAuth();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Landing vs Redirect */}
        {!currentUser ? (
          <Route path={GENERAL_ROUTES.BLANK} element={<HomeIndexPage />} />
        ) : (
          <Route
            path={GENERAL_ROUTES.BLANK}
            element={<Navigate to={GENERAL_ROUTES.HOME_MAIN} replace />}
          />
        )}

        {/* Auth routes */}
        <Route path={USER_ROUTES.AUTH} element={<RegisterPage />} />

        <Route
          path={USER_ROUTES.RESET_PASSWORD}
          element={<ResetPasswordPage />}
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AuthenticatedLayout />}>
            {/* Dashboard/Home */}
            <Route path={GENERAL_ROUTES.HOME_MAIN} element={<HomePage />} />

            {/* Not found */}
            <Route
              path={GENERAL_ROUTES.NO_PAGE_FOUND}
              element={<NotFound404Page />}
            />

            {/* Trade Journal Routes */}
            <Route
              path={TRADE_JOURNAL_ROUTES.TRADE_JOURNAL_ALL}
              element={<TradeJournalPage />}
            />
            <Route
              path={TRADE_JOURNAL_ROUTES.TRADE_JOURNAL_CREATE}
              element={<CreateEditTradeJournalPage />}
            />
            <Route
              path={TRADE_JOURNAL_ROUTES.TRADE_JOURNAL_EDIT_ID}
              element={<CreateEditTradeJournalPage />}
            />

            {/* Watchlist Routes */}
            <Route
              path={WATCHLIST_ROUTES.WATCHLIST_ALL}
              element={<WatchlistPage />}
            />
            <Route
              path={WATCHLIST_ROUTES.WATCHLIST_CREATE}
              element={<CreateEditWatchlistPage />}
            />
            <Route
              path={WATCHLIST_ROUTES.WATCHLIST_EDIT_ID}
              element={<CreateEditWatchlistPage />}
            />

            {/* Risk Routes */}
            <Route path={RISK_ROUTES.RISK} element={<RiskManagementPage />} />
            <Route
              path={RISK_ROUTES.RISK_EDIT_ID}
              element={<RiskManagementPage />}
            />
            <Route
              path={RISK_ROUTES.RISK_ALL}
              element={<ManageRiskManagementPage />}
            />

            {/* Onboarding Routes */}
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Pricing Routes */}
            <Route path={PRICING_ROUTES.PRICING} element={<PricingPage />} />
            <Route
              path={PRICING_ROUTES.PRICING_CHECKOUT}
              element={<PricingCheckoutPage />}
            />

            {/* Console Routes */}
            <Route
              path={CONSOLE_ROUTES.CONSOLE_DASH}
              element={<ConsoleDashPage />}
            />
            <Route
              path={CONSOLE_ROUTES.CONSOLE_TRADES}
              element={<ConsoleTradesPage />}
            />
            <Route
              path={CONSOLE_ROUTES.CONSOLE_REPORTS}
              element={<ConsoleReportsPage />}
            />
            <Route
              path={CONSOLE_ROUTES.CONSOLE_ANALYSIS}
              element={<ConsoleAnalysisPage />}
            />

            {/* User Profile */}
            <Route
              path={USER_PROFILE_ROUTES.PROFILE}
              element={<ProfilePage />}
            />

            {/* Contact Us */}
            <Route path={CONTACT_US_ROUTES.CONTACT} element={<ContactPage />} />

            {/* Broker */}
            <Route
              path={BROKER_ROUTES.BROKER_ALL}
              element={<ManageBrokerDematAccountsPage />}
            />
            <Route
              path={BROKER_ROUTES.BROKER_CREATE}
              element={<CreateEditBrokerDematAccountsPage />}
            />
            <Route
              path={BROKER_ROUTES.BROKER_EDIT_ID}
              element={<CreateEditBrokerDematAccountsPage />}
            />

            {/* Trading Strategy */}
            <Route
              path={TRADING_STRATEGY_ROUTES.TRADING_STRATEGY_ALL}
              element={<TradingStrategyPage />}
            />
            <Route
              path={TRADING_STRATEGY_ROUTES.TRADING_STRATEGY_CREATE}
              element={<CreateEditTradingStrategyPage />}
            />
            <Route
              path={TRADING_STRATEGY_ROUTES.TRADING_STRATEGY_EDIT_ID}
              element={<CreateEditTradingStrategyPage />}
            />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
