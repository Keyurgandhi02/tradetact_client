import { format, parseISO } from "date-fns";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { getFirebaseData } from "../config/firestoreOperations";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";
import { useAuth } from "../store/AuthContext";
import { useLoading } from "../store/LoadingContext";
import { formatNumber, renderActiveShape } from "../config/helper";
import LongCard from "../components/LongCard";
import LongCardItem from "../components/LongCardItem";
import CardTitle from "../components/CardTitle";
import {
  TRADE_ANALYSIS_DETAILS_COLUMNS,
  TRADE_ANALYSIS_USER_COLUMNS,
} from "../constants/Columns";
import {
  AreaChart,
  Area,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  XAxis,
} from "recharts";

// Donut chart colors
const COLORS = [
  "#e60049",
  "#0bb4ff",
  "#50e991",
  "#e6d800",
  "#9b19f5",
  "#ffa300",
  "#dc0ab4",
  "#b3d4ff",
  "#00bfa0",
];

function AnalyticsPage() {
  const { currentUser } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const [fetchedData, setFetchedData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

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
    const userMonthlyData = {};

    fetchedData.forEach((item) => {
      const user = item?.dematUser;
      const date =
        item?.buyDate && format(parseISO(item.buyDate), "yyyy-MM-dd");
      const plDate = item?.buyDate && format(parseISO(item.buyDate), "MMM-yy");

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

      if (!userMonthlyData[user]) userMonthlyData[user] = {};
      if (!userMonthlyData[user][plDate]) {
        userMonthlyData[user][plDate] = {
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

      userMonthlyData[user][plDate].totalProfitLoss += profitLoss;
      userMonthlyData[user][plDate].totalItems += 1;
      userMonthlyData[user][plDate].totalBought += entryValue;
      userMonthlyData[user][plDate].totalSold += exitValue;

      if (profitLoss > 0) {
        userMonthlyData[user][plDate].profitCount += 1;
      } else {
        userMonthlyData[user][plDate].lossCount += 1;
      }
    });

    const allDates = Array.from(
      new Set(Object.values(userTrades).flatMap(Object.keys))
    ).sort();

    // Prepare data for Recharts
    const chartData = allDates.map((date) => {
      let dataPoint = { date };
      Object.keys(userTrades).forEach((user) => {
        dataPoint[user] = userTrades[user][date] || 0;
      });
      return dataPoint;
    });

    const userCounts = Object.keys(userTrades).map((user) => ({
      label: user,
      count: Object.values(userTrades[user]).reduce((a, b) => a + b, 0),
    }));

    return {
      chartData,
      userCounts,
      monthlyData,
      userMonthlyData,
    };
  }, [fetchedData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const getSortedMonths = (userMonthlyData) => {
    const allMonths = new Set();

    Object.keys(userMonthlyData).forEach((user) => {
      Object.keys(userMonthlyData[user]).forEach((month) => {
        allMonths.add(month);
      });
    });

    return Array.from(allMonths).sort((a, b) => new Date(b) - new Date(a));
  };

  const rowsData1 = getSortedMonths(computedData.userMonthlyData).flatMap(
    (month) =>
      Object.keys(computedData.userMonthlyData)
        .map((user) => {
          const userMonthData = computedData.userMonthlyData[user]?.[month];
          if (!userMonthData) return null;

          return {
            user,
            month,
            totalItems: userMonthData.totalItems || 0,
            profitCount: userMonthData.profitCount || 0,
            lossCount: userMonthData.lossCount || 0,
            totalProfitLoss: formatNumber(userMonthData.totalProfitLoss || 0),
            totalBought: formatNumber(userMonthData.totalBought || 0),
            totalSold: formatNumber(userMonthData.totalSold || 0),
          };
        })
        .filter(Boolean)
  );

  // Pie Enter Show Design
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <>
      {fetchedData.length > 0 && (
        <>
          <div className="p-4 mt-4 grid grid-cols-1 gap-4 md:grid-cols-12 md:mt-6 2xl:mt-7.5 2xl:gap-7.5">
            <div className="col-span-12 md:col-span-8 rounded-md  border border-secondary px-4 py-5 shadow-default sm:px-7.5">
              <CardTitle title="Trade Analysis" />
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={computedData.chartData}>
                  <Tooltip />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), "dd/MM/yy")}
                    tick={{ fill: "#fff" }}
                    dy={10}
                  />
                  <Legend
                    verticalAlign="top"
                    iconType="circle"
                    iconSize={12}
                    wrapperStyle={{ paddingBottom: "20px" }}
                  />
                  {Object.keys(computedData.chartData[0])
                    .filter((key) => key !== "date")
                    .map((user, index) => (
                      <Area
                        key={index}
                        type="monotone"
                        dataKey={user}
                        stackId="1"
                        stroke={COLORS[index % COLORS.length]}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="col-span-12 md:col-span-4 rounded-md  border border-secondary px-4 py-5 shadow-default sm:px-7.5">
              <CardTitle title="Trade User Analysis" />
              <div className="border-b mb-5 border-black-dark-300"></div>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={computedData.userCounts}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="label"
                    onMouseEnter={onPieEnter}
                  >
                    {computedData.userCounts.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-4 mt-4 grid grid-cols-1 gap-4 md:grid-cols-12 md:mt-6 2xl:mt-7.5 2xl:gap-7.5">
            <div className="col-span-12 md:col-span-12 rounded-md  border border-secondary px-4 py-5 shadow-default sm:px-7.5">
              <CardTitle title="Trade Details Analysis" />
              <div className="h-100 overflow-y-auto no-scrollbar">
                {rowsData.map((item, i) => (
                  <LongCard
                    children={
                      <>
                        <LongCardItem
                          heading={TRADE_ANALYSIS_DETAILS_COLUMNS[0]}
                          value={item?.month}
                        />
                        <LongCardItem
                          heading={TRADE_ANALYSIS_DETAILS_COLUMNS[1]}
                          value={item?.totalItems}
                        />
                        <LongCardItem
                          heading={TRADE_ANALYSIS_DETAILS_COLUMNS[2]}
                          value={item?.profitCount}
                        />
                        <LongCardItem
                          heading={TRADE_ANALYSIS_DETAILS_COLUMNS[3]}
                          value={item?.lossCount}
                        />
                        <LongCardItem
                          heading={TRADE_ANALYSIS_DETAILS_COLUMNS[4]}
                          value={`${parseFloat(
                            (item?.profitCount / item?.totalItems) * 100
                          ).toFixed(0)}%`}
                        />
                        <LongCardItem
                          heading={TRADE_ANALYSIS_DETAILS_COLUMNS[5]}
                          value={`${parseFloat(
                            (item?.lossCount / item?.totalItems) * 100
                          ).toFixed(0)}%`}
                        />
                        <LongCardItem
                          heading={TRADE_ANALYSIS_DETAILS_COLUMNS[6]}
                          value={item?.totalProfitLoss}
                        />
                        <LongCardItem
                          heading={TRADE_ANALYSIS_DETAILS_COLUMNS[7]}
                          value={item?.totalBought}
                        />
                        <LongCardItem
                          heading={TRADE_ANALYSIS_DETAILS_COLUMNS[8]}
                          value={item?.totalSold}
                        />
                      </>
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 mt-1 grid grid-cols-1 gap-4 md:grid-cols-12 md:mt-6 2xl:mt-7.5 2xl:gap-7.5">
            <div className="col-span-12 md:col-span-12 rounded-md  border border-secondary px-4 py-5 shadow-default sm:px-7.5">
              <CardTitle title="All Accounts Trade Analysis" />
              <div className="h-100 overflow-y-auto no-scrollbar">
                {rowsData1.map((item, i) => (
                  <LongCard
                    children={
                      <>
                        <LongCardItem
                          heading={TRADE_ANALYSIS_USER_COLUMNS[0]}
                          value={item?.user}
                        />
                        <LongCardItem
                          heading={TRADE_ANALYSIS_USER_COLUMNS[1]}
                          value={item?.month}
                        />
                        <LongCardItem
                          heading={TRADE_ANALYSIS_USER_COLUMNS[2]}
                          value={item?.totalItems}
                        />
                        <LongCardItem
                          heading={TRADE_ANALYSIS_USER_COLUMNS[3]}
                          value={item?.profitCount}
                        />
                        <LongCardItem
                          heading={TRADE_ANALYSIS_USER_COLUMNS[4]}
                          value={item?.lossCount}
                        />
                        <LongCardItem
                          heading={TRADE_ANALYSIS_USER_COLUMNS[5]}
                          value={`${parseFloat(
                            (item?.profitCount / item?.totalItems) * 100
                          ).toFixed(0)}%`}
                        />
                        <LongCardItem
                          heading={TRADE_ANALYSIS_USER_COLUMNS[6]}
                          value={`${parseFloat(
                            (item?.lossCount / item?.totalItems) * 100
                          ).toFixed(0)}%`}
                        />
                        <LongCardItem
                          heading={TRADE_ANALYSIS_USER_COLUMNS[7]}
                          value={item?.totalProfitLoss}
                        />
                        <LongCardItem
                          heading={TRADE_ANALYSIS_USER_COLUMNS[8]}
                          value={item?.totalBought}
                        />
                        <LongCardItem
                          heading={TRADE_ANALYSIS_USER_COLUMNS[9]}
                          value={item?.totalSold}
                        />
                      </>
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AnalyticsPage;
