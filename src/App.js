import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import AuthenticatedLayout from "./components/AuthenticatedLayout";
import PrivateRoute from "./PrivateRoute";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import NotFound404Page from "./pages/NotFound404Page";
import MarketPage from "./pages/MarketPage";
import ManageBrokerAccountsPage from "./pages/ManageBrokerAccountsPage";
import CreateEditBrokerAccounts from "./components/CreateEditBrokerAccounts";
import ManageDematAccountsPage from "./pages/ManageDematAccountsPage";
import CreateEditDematAccounts from "./components/CreateEditDematAccounts";
import ManageStrategyPage from "./pages/ManageStrategyPage";
import CreateEditStrategy from "./components/CreateEditStrategy";

// Lazy-loaded components
const HomePage = lazy(() => import("./pages/HomePage"));
const ReturnPerformancePage = lazy(() =>
  import("./pages/ReturnPerformancePage")
);
const WatchlistPage = lazy(() => import("./pages/WatchlistPage"));
const TradeJournalPage = lazy(() => import("./pages/TradeJournalPage"));
const CreateEditWatchlist = lazy(() =>
  import("./components/CreateEditWatchlist")
);
const CreateEditTradeJournal = lazy(() =>
  import("./components/CreateEditTradeJournal")
);
const CreateEditReturnPerformance = lazy(() =>
  import("./components/CreateEditReturnPerformance")
);
const CreateEditRiskManagement = lazy(() =>
  import("./components/CreateEditRiskManagement")
);
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const UpdatesPage = lazy(() => import("./pages/UpdatesPage"));

function App() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/auth" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route element={<PrivateRoute />}>
            <Route element={<AuthenticatedLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<NotFound404Page />} />
              <Route path="/market" element={<MarketPage />} />

              <Route path="/all_watchlist" element={<WatchlistPage />} />
              <Route
                path="/create_watchlist"
                element={<CreateEditWatchlist />}
              />
              <Route
                path="/edit_watchlist/:id"
                element={<CreateEditWatchlist />}
              />
              <Route path="/all_trade_journal" element={<TradeJournalPage />} />
              <Route
                path="/create_trade_journal"
                element={<CreateEditTradeJournal />}
              />
              <Route
                path="/edit_trade_journal/:id"
                element={<CreateEditTradeJournal />}
              />
              <Route
                path="/create_risk_management"
                element={<CreateEditRiskManagement />}
              />
              <Route
                path="/all_return_performance"
                element={<ReturnPerformancePage />}
              />
              <Route
                path="/create_return_performance"
                element={<CreateEditReturnPerformance />}
              />
              <Route
                path="/edit_return_performance/:id"
                element={<CreateEditReturnPerformance />}
              />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/updates" element={<UpdatesPage />} />
              <Route
                path="/all_broker_accounts"
                element={<ManageBrokerAccountsPage />}
              />
              <Route
                path="/create_broker_accounts"
                element={<CreateEditBrokerAccounts />}
              />
              <Route
                path="/edit_broker_accounts/:id"
                element={<CreateEditBrokerAccounts />}
              />

              <Route
                path="/all_demat_accounts"
                element={<ManageDematAccountsPage />}
              />
              <Route
                path="/create_demat_accounts"
                element={<CreateEditDematAccounts />}
              />
              <Route
                path="/edit_demat_accounts/:id"
                element={<CreateEditDematAccounts />}
              />

              <Route
                path="/all_user_strategy"
                element={<ManageStrategyPage />}
              />
              <Route
                path="/create_user_strategy"
                element={<CreateEditStrategy />}
              />
              <Route
                path="/edit_user_strategy/:id"
                element={<CreateEditStrategy />}
              />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
