import { format } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import { getFirebaseData } from "../config/firestoreOperations";
import { FIREBASE_ENDPOINTS } from "../constants/apiConstants";
import { useAuth } from "../context/AuthContext";
import { useLoading } from "../context/LoadingContext";
import CardTitle from "../components/CardTitle";
import {
  ResponsiveContainer,
  XAxis,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts";
import dayjs from "dayjs";

function AnalyticsPage() {
  const { currentUser } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const [fetchedData, setFetchedData] = useState([]);
  const [pastWeekData, setPastWeekData] = useState([]);

  // Fetch Trade Data
  const fetchData = useCallback(async () => {
    const fetchedTasks = await getFirebaseData(
      FIREBASE_ENDPOINTS.MASTER_DATA,
      currentUser.uid,
      FIREBASE_ENDPOINTS.USER_TRADE_JOURNAL,
      startLoading,
      stopLoading,
      "desc",
      "buyDate",
      true
    );

    // Get today's date
    const today = dayjs();

    // Filter data for the past 7 days
    const past7DaysData = Array.from({ length: 7 }).map((_, index) => {
      const date = today.subtract(index, "day").format("YYYY-MM-DD");

      // Filter trades for this specific date
      const dailyTrades = fetchedTasks.filter(
        (trade) => trade.buyDate === date
      );

      // Calculate total profit/loss for the day
      const totalProfitLoss = dailyTrades.reduce(
        (acc, trade) => acc + parseFloat(trade.profitLossPrice),
        0
      );

      return {
        date,
        totalProfitLoss,
        trades: dailyTrades.length,
      };
    });

    setPastWeekData(past7DaysData.reverse());

    setFetchedData(fetchedTasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      {fetchedData.length > 0 && (
        <>
          <CardTitle title="Trade Weekly Analysis" />
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={pastWeekData}
              className="text-black-dark-400 dark:text-white font-bold"
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis
                dataKey="date"
                tick={{ fill: "#00c805" }}
                tickFormatter={(date) => format(new Date(date), "dd/MM/yy")}
              />

              <ReferenceLine y={0} stroke="#333A48" />
              <Bar
                dataKey="totalProfitLoss"
                fill="#ffc657"
                radius={3}
                className="text-black-dark-400 dark:text-whiten font-bold"
                label={{ position: "insideBottom", fill: "#333A48" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </>
  );
}

export default AnalyticsPage;
