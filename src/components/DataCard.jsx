import React from "react";
import * as svgIcons from "../assets/svgIcons";
import * as helper from "../config/helper";
import DataCardItem from "./DataCardItem";
import { format, parseISO } from "date-fns";

function DataCard({ data, deleteHandler, editHandler, viewHandler }) {
  return (
    <div
      key={data?.id}
      className="rounded-sm shadow-lg p-4 border-[0.6px] border-gray-500 w-full md:w-104 lg:w-114 h-auto md:h-68 lg:h-68 overflow-hidden"
    >
      <div className="flex justify-between items-center mb-2">
        <div>
          <h4 className="font-bold text-md text-black-dark-400 dark:text-whiten truncate">
            {data?.scriptName
              ? helper.convertToUpperCase(data?.scriptName)
              : "NA"}
          </h4>

          <p className="text-xs mt-2 text-black-dark-300 dark:text-whiten">
            {data?.dematUser} - {data?.broker}
          </p>
        </div>
        <span className="font-semibold text-sm text-black-dark-300 dark:text-whiten">
          {format(parseISO(data.buyDate), "dd/MM/yyyy")}
        </span>
      </div>
      <div className="border-b dark:border-black-dark-300 border-gray-500 my-3"></div>
      <div className="grid grid-cols-3 gap-4 mb-5">
        <DataCardItem
          title="ENTRY"
          data={helper.formatNumber(data?.entryPrice)}
        />
        <DataCardItem
          title="EXIT"
          data={helper.formatNumber(data?.exitPrice)}
        />
        <DataCardItem title="SL" data={helper.formatNumber(data?.slPrice)} />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-5">
        <DataCardItem
          title="TARGET"
          data={helper.formatNumber(data?.targetPrice)}
        />
        <DataCardItem title="QTY" data={data?.quantity} />
        <DataCardItem
          title="INVESTED"
          data={helper.formatNumber(
            Number(data?.entryPrice) * Number(data?.quantity)
          )}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <DataCardItem
          title="RETURNED"
          data={helper.formatNumber(
            Number(data?.exitPrice) * Number(data?.quantity)
          )}
        />
        <DataCardItem title="TYPE" data={data?.trade_type} />
        <DataCardItem title="STRATEGY" data={data?.strategyName} />
      </div>
      <div className="border-b dark:border-black-dark-300 border-gray-500 my-3"></div>
      <div className="flex justify-between items-center">
        <div>
          <button
            className="hover:text-blue-600 dark:hover:text-blue-600 text-black-dark-400 dark:text-white px-2 focus:outline-none border-none"
            onClick={() => viewHandler(data)}
          >
            <svgIcons.VIEW_SVG />
          </button>
          <button
            className="hover:text-red-600 dark:hover:text-red-600 text-black-dark-400 dark:text-white px-2 focus:outline-none border-none"
            onClick={() => deleteHandler(data?.id)}
          >
            <svgIcons.DELETE_SVG />
          </button>
          <button
            className="hover:text-green-600 dark:hover:text-green-600 text-black-dark-400 dark:text-white px-2 focus:outline-none border-none"
            onClick={() => editHandler(data?.id)}
          >
            <svgIcons.EDIT_SVG />
          </button>
        </div>
        <div
          className={`text-right text-md font-bold truncate ${
            data?.profitLossPrice > 0
              ? "text-main_color"
              : "text-main_red_color"
          }`}
        >
          {helper.formatNumber(data?.profitLossPrice)}
        </div>
      </div>
    </div>
  );
}

export default DataCard;
