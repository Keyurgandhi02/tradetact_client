import React, { createContext, useState, useEffect } from "react";
import { getFirebaseData, getUserByEmail } from "../config/firestoreOperations";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";
import { useLoading } from "./LoadingContext";
import { useAuth } from "./AuthContext";

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [journalData, setJournalData] = useState([]);
  const [watchListData, setWatchListData] = useState([]);
  const [fetchedBroker, setFetchedBroker] = useState([]);
  const [fetchedStrategy, setFetchedStrategy] = useState([]);
  const [isUserData, setUserData] = useState([]);

  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    if (currentUser) {
      async function fetchData() {
        const fetchedTradeJournal = await getFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_TRADE_JOURNAL,
          startLoading,
          stopLoading,
          "desc",
          "buyDate"
        );

        const fetchedWatchList = await getFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_WATCHLIST,
          startLoading,
          stopLoading,
          "desc",
          "doc_created_At"
        );

        const fetchedBroker = await getFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_MANAGE_BROKERS,
          startLoading,
          stopLoading,
          "desc",
          "doc_created_At"
        );

        const fetchedStrategy = await getFirebaseData(
          FIREBASE_ENDPOINTS.MASTER_DATA,
          currentUser.uid,
          FIREBASE_ENDPOINTS.USER_MANAGE_STRATEGY,
          startLoading,
          stopLoading,
          "desc",
          "doc_created_At"
        );

        const userData = await getUserByEmail(currentUser?.email);

        setUserData(userData);
        setJournalData(fetchedTradeJournal);
        setWatchListData(fetchedWatchList);
        setFetchedBroker(fetchedBroker);
        setFetchedStrategy(fetchedStrategy);
      }

      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);
  return (
    <DashboardContext.Provider
      value={{
        journalData,
        watchListData,
        fetchedBroker,
        fetchedStrategy,
        isUserData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
