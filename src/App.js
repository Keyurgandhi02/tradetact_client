import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AuthenticatedLayout from "./components/AuthenticatedLayout";
import ProtectedRoute from "./utils/ProtectedRoute";
import {
  BROKER_ROUTES,
  CONTACT_US_ROUTES,
  GENERAL_ROUTES,
  MARKET_ROUTES,
  RISK_MANAGE_ROUTES,
  ROI_ROUTES,
  TRADE_JOURNAL_ROUTES,
  TRADING_STRATEGY_ROUTES,
  USER_PROFILE_ROUTES,
  USER_ROUTES,
  WATCHLIST_ROUTES,
} from "./constants/routesConstants";
import {
  HomePage,
  NotFound404Page,
  MarketPage,
  ProfilePage,
  UpdatesPage,
  ResetPasswordPage,
  RegisterPage,
  RiskManagementCalculatorPage,
  ContactPage,
} from "./pages/index";
import { WatchlistPage, CreateEditWatchlistPage } from "./pages/watchlist";
import {
  TradeJournalPage,
  CreateEditTradeJournalPage,
} from "./pages/trade_journal";
import {
  CreateEditTradingStrategyPage,
  TradingStrategyPage,
} from "./pages/trading_strategy";
import {
  ManageBrokerDematAccountsPage,
  CreateEditBrokerDematAccountsPage,
} from "./pages/broker_demat";
import {
  CreateEditReturnPerformancePage,
  ReturnPerformancePage,
} from "./pages/roi";

function App() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path={USER_ROUTES.AUTH} element={<RegisterPage />} />
          <Route
            path={USER_ROUTES.RESET_PASSWORD}
            element={<ResetPasswordPage />}
          />
          <Route element={<ProtectedRoute />}>
            <Route element={<AuthenticatedLayout />}>
              {/* General Routes */}
              <Route path={GENERAL_ROUTES.BLANK} element={<HomePage />} />
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

              {/* ROI Routes */}
              <Route
                path={ROI_ROUTES.ROI_ALL}
                element={<ReturnPerformancePage />}
              />
              <Route
                path={ROI_ROUTES.ROI_CREATE}
                element={<CreateEditReturnPerformancePage />}
              />
              <Route
                path={ROI_ROUTES.ROI_EDIT_ID}
                element={<CreateEditReturnPerformancePage />}
              />

              {/* Market Routes */}
              <Route
                path={MARKET_ROUTES.MARKET_DATA}
                element={<MarketPage />}
              />

              {/* Market Updates Routes */}
              <Route
                path={MARKET_ROUTES.MARKET_UPDATES}
                element={<UpdatesPage />}
              />

              {/* Risk Management Routes */}
              <Route
                path={RISK_MANAGE_ROUTES.RISK_MANAGE_CALCULATOR}
                element={<RiskManagementCalculatorPage />}
              />

              {/* User Profile Routes */}
              <Route
                path={USER_PROFILE_ROUTES.PROFILE}
                element={<ProfilePage />}
              />
              {/* Contact Us Routes */}
              <Route
                path={CONTACT_US_ROUTES.CONTACT}
                element={<ContactPage />}
              />

            

              {/* Broker Routes */}
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

              {/* Trading Strategy Routes */}
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
    </>
  );
}

export default App;
