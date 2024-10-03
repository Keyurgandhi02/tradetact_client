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
import NoRecordFound from "../components/NoRecordFound";
import { useNavigate } from "react-router-dom";
import FloatingActionButton from "../components/FloatingActionButton";

function HomePage() {
  const { currentUser } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const [fetchedData, setFetchedData] = useState([]);
  const [watchListData, setWatchListData] = useState([]);
  const navigate = useNavigate();

  // Fetch Trade Data
  const fetchData = useCallback(async () => {
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

    setFetchedData(fetchedTradeJournal);
    setWatchListData(fetchedWatchList);
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
    <div className="md:mb-0 mb-12">
      <div className="mt-6.5 px-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
            heading="Total Gain"
            value={formatNumber(computedData.positiveTotal)}
          />
        </div>

        <div className="col-span-1">
          <Card
            icon={<MINUS_SVG />}
            heading="Total Loss"
            value={formatNumber(computedData.negativeTotal)}
          />
        </div>

        <div className="col-span-1">
          <Card
            icon={<RealizedPLSVG />}
            heading="Overall G/L"
            value={formatNumber(computedData.combinedTotal)}
          />
        </div>
      </div>

      <div className="mt-1 px-3 grid grid-cols-1 gap-2 md:grid-cols-12 lg:grid-cols-12 2xl:gap-4.5">
        <div className="col-span-8 md:col-span-8 lg:col-span-8 rounded-sm bg-black-dark-400 px-3 py-5 shadow-default sm:px-5.5 flex flex-col">
          <CardTitle title="Market Updates" />
          <div className="h-[350px] overflow-y-auto no-scrollbar">
            <UpdateInfoCard />
          </div>
        </div>

        <div className="col-span-8 md:col-span-4 lg:col-span-4 rounded-sm bg-black-dark-400 px-3 py-5 shadow-default sm:px-5.5 flex flex-col">
          <CardTitle title="Watchlist" />
          <div className="h-[350px] overflow-y-auto no-scrollbar">
            {watchListData.length > 0 ? (
              <ul className="flex flex-col">
                {watchListData.map((item, i) => (
                  <li className="flex flex-row mb-2" key={i}>
                    <div className="select-none cursor-pointer bg-black-dark-100 rounded-sm flex flex-1 items-center p-4  transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                      <div className="flex-1 pl-1 mr-16">
                        <div className="font-bold text-primary-200">
                          {item.scriptName}
                        </div>
                        <div className="text-gray-600 text-xs mt-1">
                          {item.status}
                        </div>
                      </div>
                      <div className="text-white text-xs">
                        {item.strategyName}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <NoRecordFound
                heading="This watchlist is empty. Tap on `Add Stocks` to add items in the watchlist."
                handleSubmit={() => navigate("/create_watchlist")}
                btnTitle="Add Stocks"
                isSmallSize={true}
                isButtonVisible={true}
              />
            )}
          </div>
        </div>
        <FloatingActionButton />
      </div>

      <AnalyticsPage />
    </div>
  );
}

export default HomePage;
