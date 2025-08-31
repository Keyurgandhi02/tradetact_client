import React, { createContext, useState, useEffect, useCallback } from "react";
import { getFirebaseData, getUserByEmail } from "../config/firestoreOperations";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";
import { useLoading } from "./LoadingContext";
import { useAuth } from "./AuthContext";
import * as firestore from "firebase/firestore";
import db from "../utils/firebase-config";
import { addMonths, isAfter } from "date-fns";
import { convertFirebaseTimestamp } from "../config/helper";

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [journalData, setJournalData] = useState([]);
  const [watchListData, setWatchListData] = useState([]);
  const [fetchedBroker, setFetchedBroker] = useState([]);
  const [fetchedStrategy, setFetchedStrategy] = useState([]);
  const [planStatus, setPlanStatus] = useState("free");
  const [subscriptionData, setSubscriptionData] = useState([]);

  const { startLoading, stopLoading } = useLoading();

  // Fetch data function
  const fetchData = useCallback(async () => {
    if (!currentUser) return;

    const fetchedTradeJournal = await getFirebaseData(
      FIREBASE_ENDPOINTS.MASTER_DATA,
      FIREBASE_ENDPOINTS.USER_TRADE_JOURNAL,
      startLoading,
      stopLoading,
      "desc",
      "buyDate",
      true
    );

    const fetchedWatchList = await getFirebaseData(
      FIREBASE_ENDPOINTS.MASTER_DATA,
      FIREBASE_ENDPOINTS.USER_WATCHLIST,
      startLoading,
      stopLoading,
      "desc",
      "doc_created_At",
      true
    );

    const fetchedBroker = await getFirebaseData(
      FIREBASE_ENDPOINTS.MASTER_DATA,
      FIREBASE_ENDPOINTS.USER_MANAGE_BROKERS,
      startLoading,
      stopLoading,
      "desc",
      "doc_created_At",
      true
    );

    const fetchedStrategy = await getFirebaseData(
      FIREBASE_ENDPOINTS.MASTER_DATA,
      FIREBASE_ENDPOINTS.USER_MANAGE_STRATEGY,
      startLoading,
      stopLoading,
      "desc",
      "doc_created_At",
      true
    );

    // const status = await checkPlanStatus();
    // setPlanStatus(status);
    setJournalData(fetchedTradeJournal);
    setWatchListData(fetchedWatchList);
    setFetchedBroker(fetchedBroker);
    setFetchedStrategy(fetchedStrategy);
  }, [currentUser]);

  // const checkPlanStatus = async () => {
  //   const userData = await getUserByEmail(currentUser?.email);

  //   if (!userData) return;

  //   const userDocRef = firestore.doc(
  //     db,
  //     FIREBASE_ENDPOINTS.USER_AUTH,
  //     userData?.id
  //   );

  //   if (userData.subscription_status === true) {
  //     if (userData?.subscription?.createdAt) {
  //       const subDate = convertFirebaseTimestamp(
  //         userData?.subscription?.createdAt?.seconds,
  //         userData?.subscription?.createdAt?.nanoseconds
  //       );

  //       const purchaseTimestamp = new Date(subDate); // Get purchase date
  //       const planDuration =
  //         userData?.subscription?.planDetails?.planDurationMonth; // Plan duration in months

  //       // Calculate the expiration date by adding the plan duration to the purchase date
  //       const expirationDate = addMonths(purchaseTimestamp, planDuration);

  //       // Check if the current date is after the expiration date
  //       const isPlanExpired = isAfter(new Date(), expirationDate);

  //       setSubscriptionData({
  //         ...userData,
  //         expirationDate: expirationDate,
  //         purchaseTimestamp: purchaseTimestamp,
  //       });

  //       if (isPlanExpired) {
  //         // Plan has expired, revert the user to the free plan
  //         await firestore.updateDoc(userDocRef, {
  //           subscription_status: false,
  //         });
  //         return "expired";
  //       } else {
  //         return "active";
  //       }
  //     }
  //   } else {
  //     return "free";
  //   }
  // };

  useEffect(() => {
    if (currentUser?.uid) {
      fetchData();
    }
  }, [currentUser, fetchData]);

  return (
    <DashboardContext.Provider
      value={{
        journalData,
        watchListData,
        fetchedBroker,
        fetchedStrategy,
        planStatus,
        subscriptionData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
