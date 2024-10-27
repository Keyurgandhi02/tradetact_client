import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { format, parseISO } from "date-fns";
import { getFirebaseData } from "../../config/firestoreOperations";
import { FIREBASE_ENDPOINTS } from "../../constants/apiConstants";
import { useAuth } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import CalendarWrapper from "../../components/CalendarWrapper";
import { DashboardContext } from "../../context/DashboardContext";
import Card from "../../components/Card";
import { formatNumber } from "../../config/helper";
import AlertCard from "../../components/AlertCard";
import ModalDialog from "../../components/ModalDialog";
import Dots from "../../components/Dots";
import NoRecordFound from "../../components/NoRecordFound";
import { TRADE_JOURNAL_ROUTES } from "../../constants/routesConstants";
import { useNavigate } from "react-router-dom";

function ConsoleDashPage() {
  const { currentUser } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const [fetchedData, setFetchedData] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [isViewModal, setViewModal] = useState(false);
  const navigate = useNavigate();
  const { journalData } = useContext(DashboardContext);

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

  // Fetch data function
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

    setFetchedData(fetchedTasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groupByMonth = useCallback(() => {
    return fetchedData?.reduce((acc, trade) => {
      const month =
        trade?.buyDate && format(parseISO(trade.buyDate), "MMMM yyyy");

      if (!acc[month]) {
        acc[month] = {
          trades: [],
          totalProfitLoss: 0,
        };
      }

      acc[month].trades.push(trade);
      acc[month].totalProfitLoss += parseFloat(trade.profitLossPrice);

      return acc;
    }, {});
  }, [fetchedData]);

  // Update groupedData whenever fetchedData changes
  useEffect(() => {
    const grouped = groupByMonth();
    setGroupedData(grouped);
  }, [groupByMonth]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="mt-6.5 px-3 mb-5">
      <div className="mt-6.5 px-3 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
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

      {fetchedData.length > 0 && (
        <div className="px-3">
          <AlertCard
            bgColor="bg-transparent"
            borderColor="border-gray-500"
            textColor="text-gray-500"
            heading="What do these circles indicate?"
            child={
              <>
                <Dots color="bg-green-500" width="4" height="4" />
                <Dots color="bg-red-500" width="4" height="4" />
              </>
            }
            action={
              <>
                <span
                  className="text-main_color cursor-pointer"
                  onClick={() => setViewModal(true)}
                >
                  Know more
                </span>
              </>
            }
          />
        </div>
      )}

      <CalendarWrapper groupedData={groupedData} />

      {fetchedData.length === 0 && (
        <NoRecordFound
          heading="Your trade journal is empty. Click Add Trade to add trade in your journal"
          handleSubmit={() =>
            navigate(TRADE_JOURNAL_ROUTES.TRADE_JOURNAL_CREATE)
          }
          btnTitle="Add Trade"
          isSmallSize={false}
          isButtonVisible={true}
        />
      )}

      <ModalDialog
        isOpen={isViewModal}
        onClose={() => setViewModal(false)}
        children={
          <div className="p-12">
            <p className="text-black-dark-400 dark:text-whiten font-semibold text-md">
              The variety of colours on the circular gauges in the calendar
              represent the proportion of profit / loss incurred on the
              respective date.
            </p>

            <div className="flex flex-col items-center space-y-4 mt-10">
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col items-center">
                  <Dots color="bg-green-500" width="5" height="5" />
                  <span className="text-black-dark-400 dark:text-whiten mt-2 font-semibold text-sm">
                    Huge Profit
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <Dots color="bg-green-300" width="5" height="5" />
                  <span className="text-black-dark-400 dark:text-whiten mt-2 font-semibold text-sm">
                    Moderate Profit
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <Dots color="bg-red-500" width="5" height="5" />
                  <span className="text-black-dark-400 dark:text-whiten mt-2 font-semibold text-sm">
                    Huge Loss
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <Dots color="bg-red-300" width="5" height="5" />
                  <span className="text-black-dark-400 dark:text-whiten mt-2 font-semibold text-sm">
                    Moderate Loss
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}

export default ConsoleDashPage;
