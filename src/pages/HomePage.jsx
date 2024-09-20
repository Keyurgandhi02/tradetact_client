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
import CardTitle from "../components/CardTitle";
import { useLoading } from "../store/LoadingContext";
import UpdateInfoCard from "../components/UpdateInfoCard";
import AnalyticsPage from "./AnalyticsPage";

function HomePage() {
  const { currentUser } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const [fetchedData, setFetchedData] = useState([]);

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
      <div className="p-3 grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4 mt-1">
        <div className="col-span-12 px-4 py-3 ">
          <div className="font-bold text-xl mt-1 text-primary-200 leading-none">
            Good day, {currentUser?.displayName}
          </div>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="col-span-1">
          <Card
            icon={<GainSVG />}
            heading="Winning Trades"
            value={computedData.positiveCount}
          />
        </div>

        <div className="col-span-1">
          <Card
            icon={<LossSVG />}
            heading="Lossing Trades"
            value={computedData.negativeCount}
          />
        </div>
        <div className="col-span-1">
          <Card
            icon={<TotalTradesSVG />}
            heading="Total Trades"
            value={fetchedData.length}
          />
        </div>

        <div className="col-span-1">
          <Card
            icon={<PLUS_SVG />}
            heading="Overall Gain"
            value={formatNumber(computedData.positiveTotal)}
          />
        </div>

        <div className="col-span-1">
          <Card
            icon={<MINUS_SVG />}
            heading="Overall Loss"
            value={formatNumber(computedData.negativeTotal)}
          />
        </div>

        <div className="col-span-1">
          <Card
            icon={<RealizedPLSVG />}
            heading="Realized P&L"
            value={formatNumber(computedData.combinedTotal)}
          />
        </div>
      </div>

      <div className="p-3 grid grid-cols-1 gap-4 md:grid-cols-12 lg:grid-cols-12 2xl:gap-7.5">
        <div className="col-span-12 md:col-span-12 lg:col-span-12 rounded-md border border-secondary px-4 py-5 shadow-default sm:px-7.5 flex flex-col">
          <CardTitle title="Market Updates" />
          <div className="h-[200px] overflow-y-auto no-scrollbar">
            <UpdateInfoCard />
          </div>
        </div>
      </div>

      <AnalyticsPage />
    </>
  );
}

export default HomePage;
