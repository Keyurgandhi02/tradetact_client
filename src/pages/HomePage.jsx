import React, { useContext, useMemo } from "react";
import Card from "../components/Card";
import { formatNumber } from "../config/helper";
import CardTitle from "../components/CardTitle";
import UpdateInfoCard from "../components/UpdateInfoCard";
import { AnalyticsPage } from "./index";
import NoRecordFound from "../components/NoRecordFound";
import { useNavigate } from "react-router-dom";
import { DashboardContext } from "../context/DashboardContext";
import { WATCHLIST_ROUTES } from "../constants/routesConstants";
function HomePage() {
  const navigate = useNavigate();
  const { journalData, watchListData } = useContext(DashboardContext);

  // Compute Trade Data
  const computedData = useMemo(() => {
    let positiveTotal = 0;
    let negativeTotal = 0;
    let positiveCount = 0;
    let negativeCount = 0;

    journalData.forEach((item) => {
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
  }, [journalData]);

  return (
    <div className="md:mb-0 mb-12">
      <div className="mt-6.5 px-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="col-span-1">
          <Card heading="Winning Trades" value={computedData.positiveCount} />
        </div>
        <div className="col-span-1">
          <Card heading="Lossing Trades" value={computedData.negativeCount} />
        </div>
        <div className="col-span-1">
          <Card heading="Total Trades" value={journalData.length} />
        </div>

        <div className="col-span-1">
          <Card
            heading="Total Gain"
            value={formatNumber(computedData.positiveTotal)}
          />
        </div>

        <div className="col-span-1">
          <Card
            heading="Total Loss"
            value={formatNumber(computedData.negativeTotal)}
          />
        </div>

        <div className="col-span-1">
          <Card
            heading="Overall G/L"
            value={formatNumber(computedData.combinedTotal)}
          />
        </div>
      </div>

      <div className="mt-1 px-3 grid grid-cols-1 gap-2 md:grid-cols-12 lg:grid-cols-12 2xl:gap-4.5">
        <div className="col-span-8 md:col-span-8 lg:col-span-8 rounded-sm border-[0.6px] border-gray-500 bg-transparent px-3 py-5 shadow-default sm:px-5.5 flex flex-col">
          <CardTitle title="Market Updates" />
          <div className="h-[350px] overflow-y-auto no-scrollbar">
            <UpdateInfoCard />
          </div>
        </div>

        <div className="col-span-8 md:col-span-4 lg:col-span-4 rounded-sm border-[0.6px] border-gray-500 bg-transparent px-3 py-5 shadow-default sm:px-5.5 flex flex-col">
          <CardTitle title="Watchlist" />
          <div className="h-[350px] overflow-y-auto no-scrollbar">
            {watchListData.length > 0 ? (
              <ul className="flex flex-col">
                {watchListData.map((item, i) => (
                  <li className="flex flex-row mb-2" key={i}>
                    <div className="select-none cursor-pointer border-[0.6px] border-gray-500 dark:border-none bg-transparent rounded-md flex flex-1 items-center p-4">
                      <div className="flex-1 pl-1 mr-16">
                        <div className="font-bold text-black-dark-400 dark:text-white">
                          {item.scriptName}
                        </div>
                        <div className="text-gray-600 dark:text-gray-100 text-sm mt-1">
                          {item.status}
                        </div>
                      </div>
                      <div className="text-black-dark-300 dark:text-white text-xs">
                        {item.strategyName}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <NoRecordFound
                heading="This watchlist is empty. Tap on `Add Stocks` to add items in the watchlist."
                handleSubmit={() => navigate(WATCHLIST_ROUTES.WATCHLIST_CREATE)}
                btnTitle="Add Stocks"
                isSmallSize={true}
                isButtonVisible={true}
              />
            )}
          </div>
        </div>
      </div>
      <AnalyticsPage />
    </div>
  );
}

export default HomePage;
