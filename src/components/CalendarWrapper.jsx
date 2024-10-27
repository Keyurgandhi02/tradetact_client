import React, { useState } from "react";
import CalendarMonth from "./MonthlyCalendar";
import ModalDialog from "./ModalDialog";
import { formatNumber } from "../config/helper";

const CalendarWrapper = ({ groupedData }) => {
  const [isViewModal, setViewModal] = useState(false);
  const [isData, setData] = useState([]);

  return (
    <>
      <div className="mt-6.5 px-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Object.keys(groupedData).map((monthYear) => {
          const [monthName, year] = monthYear.split(" ");
          const month = new Date(`${monthName} 1, ${year}`).getMonth();
          const trades = groupedData[monthYear].trades || [];

          return (
            <CalendarMonth
              key={monthYear}
              monthName={monthName}
              year={parseInt(year, 10)}
              month={month}
              trades={trades}
              modalHandler={(status, data) => {
                setViewModal(status);
                setData(data);
              }}
            />
          );
        })}
      </div>

      <ModalDialog
        isOpen={isViewModal}
        onClose={() => setViewModal(false)}
        children={
          <table className="w-full text-sm text-center">
            <thead className="text-md text-main_color uppercase">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Script
                </th>
                <th scope="col" className="py-3 px-6">
                  Account
                </th>
                <th scope="col" className="py-3 px-6">
                  Trade Type
                </th>
                <th scope="col" className="py-3 px-6">
                  P/L
                </th>
              </tr>
            </thead>
            <tbody>
              {isData.map((trade) => (
                <tr className="text-sm text-black-dark-400 dark:text-whiten">
                  <td className="py-4 px-1 text-ellipsis uppercase">
                    {trade?.scriptName ? trade?.scriptName : "NA"}
                  </td>
                  <td className="py-4 px-1 text-ellipsis uppercase">
                    {trade?.dematUser ? trade?.dematUser : "NA"}
                  </td>
                  <td className="py-4 px-1 text-ellipsis uppercase">
                    {trade?.trade_type ? trade?.trade_type : "NA"}
                  </td>
                  <td
                    className={`py-4 px-1 text-ellipsis ${
                      trade?.profitLossPrice > 0
                        ? "text-main_color"
                        : "text-main_red_color"
                    }`}
                  >
                    {formatNumber(trade?.profitLossPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      />
    </>
  );
};

export default CalendarWrapper;
