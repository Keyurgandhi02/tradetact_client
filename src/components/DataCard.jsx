import React from "react";
import { convertToUpperCase, formatNumber } from "../config/helper";
import { DELETE_SVG, EDIT_SVG, VIEW_SVG } from "../UI/GlobalSVG";
import DataCardItem from "./DataCardItem";

function DataCard({ data, deleteHandler, editHandler, viewHandler }) {
  return (
    <div
      key={data?.id}
      className="rounded-md shadow-md p-4 bg-black-dark-400 w-full md:w-104 lg:w-114 h-auto md:h-68 lg:h-68 overflow-hidden"
    >
      <div className="flex justify-between items-center mb-2">
        <div>
          <h4 className="font-bold text-md text-whiten truncate">
            {data?.scriptName ? convertToUpperCase(data?.scriptName) : "NA"}
          </h4>
          <p className="text-sm text-gray-500">
            {data?.trade_type ? data?.trade_type : "NA"}
          </p>
        </div>
        <span className="font-semibold text-sm text-whiten">
          {data?.buyDate}
        </span>
      </div>
      <div className="border-b border-black-dark-300 my-3"></div>
      <div className="grid grid-cols-3 gap-4 mb-5">
        <DataCardItem title="ENTRY" data={formatNumber(data?.entryPrice)} />
        <DataCardItem title="EXIT" data={formatNumber(data?.exitPrice)} />
        <DataCardItem title="SL" data={formatNumber(data?.slPrice)} />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-5">
        <DataCardItem title="TARGET" data={formatNumber(data?.targetPrice)} />
        <DataCardItem title="QTY" data={data?.quantity} />
        <DataCardItem
          title="INVESTED"
          data={formatNumber(Number(data?.entryPrice) * Number(data?.quantity))}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <DataCardItem
          title="RETURNED"
          data={formatNumber(Number(data?.exitPrice) * Number(data?.quantity))}
        />
        <DataCardItem title="USER" data={data?.dematUser} />
        <DataCardItem title="STRATEGY" data={data?.strategyName} />
      </div>
      <div className="border-b border-black-dark-300 my-3"></div>
      <div className="flex justify-between items-center">
        <div className="text-gray-500">
          <button
            className="hover:text-blue-600 px-2"
            onClick={() => viewHandler(data)}
          >
            <VIEW_SVG />
          </button>
          <button
            className="hover:text-red-600 px-2"
            onClick={() => deleteHandler(data?.id)}
          >
            <DELETE_SVG />
          </button>
          <button
            className="hover:text-green-600 px-2"
            onClick={() => editHandler(data?.id)}
          >
            <EDIT_SVG />
          </button>
        </div>
        <div
          className={`text-right text-md font-bold truncate ${
            data?.profitLossPrice > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {formatNumber(data?.profitLossPrice)}
        </div>
      </div>
    </div>
  );
}

export default DataCard;
