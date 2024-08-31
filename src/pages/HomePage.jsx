import React, { useCallback, useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import { getFirebaseData } from "../config/firestoreOperations";
import { formatNumber } from "../config/helper";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";
import { useAuth } from "../store/AuthContext";
import {
  GainSVG,
  LossSVG,
  MINUS_SVG,
  PLUS_SVG,
  RealizedPLSVG,
  TotalTradesSVG,
} from "../UI/GlobalSVG";

import { useLoading } from "../store/LoadingContext";
import { useNavigate } from "react-router-dom";
import UpdateInfoCard from "../components/UpdateInfoCard";

function HomePage() {
  const { currentUser } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const [fetchedData, setFetchedData] = useState([]);
  const navigate = useNavigate();

  // Fetch Trade Data
  const fetchData = useCallback(async () => {
    const fetchedTasks = await getFirebaseData(
      FIREBASE_ENDPOINTS.MASTER_DATA,
      currentUser.uid,
      FIREBASE_ENDPOINTS.USER_TRADE_JOURNAL,
      startLoading,
      stopLoading,
      "desc",
      "buyDate"
    );

    setFetchedData(fetchedTasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.uid]);

  // Compute Trade Data
  const computedData = useMemo(() => {
    let positiveTotal = 0;
    let negativeTotal = 0;
    let positiveCount = 0;
    let negativeCount = 0;

    fetchedData.forEach((item) => {
      const price = parseFloat(item?.profitLossPrice);
      if (!isNaN(price)) {
        if (price > 0) {
          positiveTotal += price;
          positiveCount += 1;
        } else {
          negativeTotal += price;
          negativeCount += 1;
        }
      }
    });

    return {
      positiveTotal,
      negativeTotal,
      combinedTotal: positiveTotal + negativeTotal,
      positiveCount,
      negativeCount,
    };
  }, [fetchedData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div className="mt-5 p-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3 2xl:gap-7.5">
        <Card
          icon={<GainSVG />}
          onClickHandler={() => navigate("/all_trade_journal")}
          heading="Winning Trades"
          value={computedData.positiveCount}
        />
        <Card
          icon={<LossSVG />}
          heading="Lossing Trades"
          onClickHandler={() => navigate("/all_trade_journal")}
          value={computedData.negativeCount}
        />

        <Card
          icon={<TotalTradesSVG />}
          heading="Total Trades"
          onClickHandler={() => navigate("/all_trade_journal")}
          value={fetchedData.length}
        />
      </div>

      <div className="p-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3 2xl:gap-7.5">
        <Card
          icon={<PLUS_SVG />}
          heading="Overall Gain"
          value={formatNumber(computedData.positiveTotal)}
        />
        <Card
          icon={<MINUS_SVG />}
          heading="Overall Loss"
          value={formatNumber(computedData.negativeTotal)}
        />
        <Card
          icon={<RealizedPLSVG />}
          heading="Realized P&L"
          value={formatNumber(computedData.combinedTotal)}
        />
      </div>

      <div className="p-4 mt-4 grid grid-cols-1 gap-4 md:grid-cols-12 md:mt-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 md:col-span-12 rounded-xl bg-black-dark-200 px-4 py-5 shadow-default sm:px-7.5">
          <h4 className="mb-2 mt-4 text-xl font-bold text-primary-400">
            Top Updates
          </h4>
          <div className="h-84 overflow-y-auto">
            <UpdateInfoCard />
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
