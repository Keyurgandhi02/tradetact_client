import React, { useCallback, useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { getFirebaseData } from "../../config/firestoreOperations";
import { FIREBASE_ENDPOINTS } from "../../constants/apiConstants";
import { useAuth } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import AccordionItem from "../../components/AccordionItem";
import LongCardItem from "../../components/LongCardItem";
import { TRADE_ANALYSIS_DETAILS_CONSOLE_COLUMNS } from "../../constants/Columns";
import LongCard from "../../components/LongCard";
import { convertToUpperCase, formatNumber } from "../../config/helper";
import NoRecordFound from "../../components/NoRecordFound";
import { TRADE_JOURNAL_ROUTES } from "../../constants/routesConstants";
import { useNavigate } from "react-router-dom";
import ModalDialog from "../../components/ModalDialog";
import DataCardItem from "../../components/DataCardItem";
import * as helper from "../../config/helper";

function ConsoleTradesPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const [fetchedData, setFetchedData] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [openIndex, setOpenIndex] = useState(null);
  const [isViewModal, setViewModal] = useState(false);
  const [isData, setData] = useState({});

  // Toggle function to open/close accordion
  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Fetch data function
  const fetchData = useCallback(async () => {
    const fetchedTasks = await getFirebaseData(
      FIREBASE_ENDPOINTS.MASTER_DATA,

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

  const viewModalHandler = (data, status) => {
    setData(data);
    setViewModal(status);
  };

  return (
    <div className="mt-6.5 px-3">
      {Object.entries(groupedData).length > 0 ? (
        <div>
          {Object.entries(groupedData).map(([month, data], index) => (
            <AccordionItem
              key={month}
              index={index}
              title={`${month} -  ${data?.trades?.length} Trades`}
              content={
                <div className="list-none w-full ">
                  {data.trades.map((trade, index) => (
                    <LongCard
                      key={trade.id}
                      children={
                        <>
                          <LongCardItem
                            heading={TRADE_ANALYSIS_DETAILS_CONSOLE_COLUMNS[0]}
                            value={trade?.buyDate}
                          />
                          <LongCardItem
                            heading={TRADE_ANALYSIS_DETAILS_CONSOLE_COLUMNS[1]}
                            value={convertToUpperCase(trade?.scriptName)}
                          />
                          <LongCardItem
                            heading={TRADE_ANALYSIS_DETAILS_CONSOLE_COLUMNS[3]}
                            value={trade?.entryPrice}
                          />

                          <LongCardItem
                            heading={TRADE_ANALYSIS_DETAILS_CONSOLE_COLUMNS[4]}
                            value={trade?.exitPrice}
                          />

                          <LongCardItem
                            heading={TRADE_ANALYSIS_DETAILS_CONSOLE_COLUMNS[5]}
                            dvalue={formatNumber(trade?.profitLossPrice)}
                            isAmount={true}
                          />
                          <div className="text-center py-5 w-full sm:w-42 h-auto sm:h-12">
                            <span
                              className="cursor-pointer text-secondary font-semibold"
                              onClick={() =>
                                viewModalHandler(data?.trades[index], true)
                              }
                            >
                              View Details
                            </span>
                          </div>
                        </>
                      }
                      className="mt-3 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:justify-around "
                    />
                  ))}
                </div>
              }
              isOpen={openIndex === index} // Check if the current index is open
              toggleItem={toggleItem} // Pass toggle function
            />
          ))}
        </div>
      ) : (
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
            <div className="grid grid-cols-3 gap-4 mb-5">
              <DataCardItem title="USER" data={isData?.dematUser} />
              <DataCardItem title="BROKER" data={isData?.broker} />
              <DataCardItem title="TYPE" data={isData?.trade_type} />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-5">
              <DataCardItem title="QTY" data={isData?.quantity} />
              <DataCardItem
                title="INVESTED"
                data={helper.formatNumber(
                  Number(isData?.entryPrice) * Number(isData?.quantity)
                )}
              />
              <DataCardItem
                title="RETURNED"
                data={helper.formatNumber(
                  Number(isData?.exitPrice) * Number(isData?.quantity)
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-5">
              <DataCardItem title="STRATEGY" data={isData?.strategyName} />
              <DataCardItem
                title="TARGET"
                data={helper.formatNumber(isData?.targetPrice)}
              />
              <DataCardItem title="SL" data={isData?.slPrice} />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-5">
              <DataCardItem
                title="EMOTIONS WHEN ENTER"
                data={isData?.emotionsWhenEnter}
              />

              <DataCardItem
                title="EMOTIONS WHEN EXIT"
                data={isData?.emotionsWhenExit}
              />

              <DataCardItem title="Rating" data={isData?.rating} />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-5">
              <DataCardItem title="MISTAKE" data={isData?.mistake} />
              <DataCardItem title="LEARNING" data={isData?.learning} />
            </div>
          </div>
        }
      />
    </div>
  );
}

export default ConsoleTradesPage;
