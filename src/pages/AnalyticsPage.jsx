import { format, parseISO } from "date-fns";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getFirebaseData } from "../config/firestoreOperations";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";
import { useAuth } from "../store/AuthContext";
import { useLoading } from "../store/LoadingContext";
import ApexCharts from "../components/ApexCharts";
import Chart from "react-apexcharts";
import { formatNumber } from "../config/helper";
import NoRecordFound from "../components/NoRecordFound";
import LongCard from "../components/LongCard";
import LongCardItem from "../components/LongCardItem";
function AnalyticsPage() {
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
    const userTrades = {};
    const monthlyData = {};

    fetchedData.forEach((item) => {
      const user = item?.dematUser;
      const date =
        item?.buyDate && format(parseISO(item.buyDate), "yyyy-MM-dd");
      const plDate =
        item?.buyDate && format(parseISO(item.buyDate), "MMMM yyyy");

      // Calculate Trade Date wise
      if (user) {
        if (!userTrades[user]) userTrades[user] = {};
        if (date) {
          userTrades[user][date] = (userTrades[user][date] || 0) + 1;
        }
      }

      if (!monthlyData[plDate]) {
        monthlyData[plDate] = {
          totalProfitLoss: 0,
          totalItems: 0,
          profitCount: 0,
          lossCount: 0,
          totalBought: 0,
          totalSold: 0,
        };
      }

      const entryValue = item?.entryPrice * item?.quantity;
      const exitValue = item?.exitPrice * item?.quantity;
      const profitLoss = parseFloat(item?.profitLossPrice);

      monthlyData[plDate].totalProfitLoss += profitLoss;
      monthlyData[plDate].totalItems += 1;
      monthlyData[plDate].totalBought += entryValue;
      monthlyData[plDate].totalSold += exitValue;

      if (profitLoss > 0) {
        monthlyData[plDate].profitCount += 1;
      } else {
        monthlyData[plDate].lossCount += 1;
      }
    });

    const allDates = Array.from(
      new Set(Object.values(userTrades).flatMap(Object.keys))
    ).sort();

    const apexChartData = {
      series: Object.keys(userTrades).map((user) => ({
        name: user,
        data: allDates.map((date) => userTrades[user][date] || 0),
      })),
      categories: allDates,
    };

    const userCounts = Object.keys(userTrades).map((user) => ({
      label: user,
      count: Object.values(userTrades[user]).reduce((a, b) => a + b, 0),
    }));

    return {
      apexChartData,
      userCounts,
      monthlyData,
    };
  }, [fetchedData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    "Month",
    "Trades",
    "Win Trades",
    "Loss Trades",
    "Total Gain",
    "Total Bought",
    "Total Sold",
  ];

  const rowsData = Object.keys(computedData.monthlyData).map((month) => ({
    month,
    totalItems: computedData.monthlyData[month].totalItems,
    profitCount: computedData.monthlyData[month].profitCount,
    lossCount: computedData.monthlyData[month].lossCount,
    totalProfitLoss: formatNumber(
      computedData.monthlyData[month].totalProfitLoss
    ),
    totalBought: formatNumber(computedData.monthlyData[month].totalBought),
    totalSold: formatNumber(computedData.monthlyData[month].totalSold),
  }));

  return (
    <>
      {fetchedData.length > 0 ? (
        <>
          <div className="p-4 mt-4 grid grid-cols-1 gap-4 md:grid-cols-12 md:mt-6 2xl:mt-7.5 2xl:gap-7.5">
            <div className="col-span-12 md:col-span-9 rounded-xl bg-black-dark-200 px-4 py-5 shadow-default sm:px-7.5">
              <ApexCharts
                series={computedData.apexChartData.series}
                categories={computedData.apexChartData.categories}
              />
            </div>

            {/* Right Donut Chart Container */}
            <div className="col-span-12 md:col-span-3 rounded-xl bg-black-dark-200 px-4 py-5 shadow-default sm:px-7.5">
              <h4 className="mb-4 mt-4 text-xl font-bold text-primary-400">
                Trade User Analysis
              </h4>
              <div className="border-b mb-5 border-black-dark-300"></div>
              <div className="donut">
                <Chart
                  options={{
                    labels: computedData.userCounts.map((user) => user.label),
                    legend: { position: "bottom" },
                    chart: { foreColor: "#fff" },
                    stroke: { colors: ["#282828"] },
                  }}
                  series={computedData.userCounts.map((user) => user.count)}
                  type="donut"
                  height={450}
                />
              </div>
            </div>
          </div>

          <div className="p-4 mt-4 grid grid-cols-1 gap-4 md:grid-cols-12 md:mt-6 2xl:mt-7.5 2xl:gap-7.5">
            <div className="col-span-12 md:col-span-12 rounded-xl bg-black-dark-200 px-4 py-5 shadow-default sm:px-7.5">
              <h4 className="mb-6 mt-4 text-xl font-bold text-primary-400">
                Trade Details Analysis
              </h4>
              {rowsData.map((item, i) => (
                <LongCard
                  children={
                    <>
                      <LongCardItem heading={columns[0]} value={item?.month} />
                      <LongCardItem
                        heading={columns[1]}
                        value={item?.totalItems}
                      />
                      <LongCardItem
                        heading={columns[2]}
                        value={item?.profitCount}
                      />
                      <LongCardItem
                        heading={columns[3]}
                        value={item?.lossCount}
                      />
                      <LongCardItem
                        heading={columns[4]}
                        value={item?.totalProfitLoss}
                      />
                      <LongCardItem
                        heading={columns[5]}
                        value={item?.totalBought}
                      />
                      <LongCardItem
                        heading={columns[6]}
                        value={item?.totalSold}
                      />
                    </>
                  }
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <NoRecordFound />
      )}
    </>
  );
}

export default AnalyticsPage;
