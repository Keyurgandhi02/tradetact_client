import React, { useState } from "react";
import PageHeading from "../../components/PageHeading";

const RiskManagementCalculator = () => {
  const [accountSize, setAccountSize] = useState(0);
  const [riskPercent, setRiskPercent] = useState(0);
  const [entryPrice, setEntryPrice] = useState(0);
  const [stopLossPrice, setStopLossPrice] = useState(0);
  const [targetPrice, setTargetPrice] = useState(0);

  const handleWheel = (e) => {
    e.target.blur(); // This prevents scrolling
  };

  const riskAmount = (accountSize * riskPercent) / 100;
  const stopLossPerShare = Math.abs(entryPrice - stopLossPrice);
  const positionSize =
    stopLossPerShare > 0 ? Math.floor(riskAmount / stopLossPerShare) : 0;
  const riskRewardRatio =
    stopLossPerShare > 0
      ? ((targetPrice - entryPrice) / stopLossPerShare).toFixed(0)
      : 0;

  return (
    <div className="md:mb-0 mb-12">
      <div className="flex flex-col gap-9 p-4 mt-5 mb-5">
        <PageHeading title={"Risk Management Calculator"} />
      </div>

      <div className="p-7">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
          <div className="mb-4.5 text-black-dark-400 dark:text-whiten w-full">
            <label className="mb-3 block text-sm font-semibold text-black-dark-400 dark:text-whiten">
              Fund Available For Trading(₹)
            </label>
            <input
              type="number"
              value={accountSize}
              onChange={(e) => setAccountSize(e.target.value)}
              style={{ MozAppearance: "textfield" }}
              onWheel={handleWheel}
              className="dark:placeholder-white placeholder-black-dark-400 w-full rounded bg-transparent border-[1.2px] border-gray-500 px-5 py-3 font-normal text-black-dark-400 dark:text-whiten outline-none transition focus:border-main_color active:border-main_color disabled:cursor-default disabled:bg-gray dark:disabled:bg-slate-600 disabled:border-none dark:focus:border-main_color"
            />
          </div>

          <div className="mb-4.5 text-black-dark-400 dark:text-whiten w-full">
            <label className="mb-3 block text-sm font-semibold text-black-dark-400 dark:text-whiten">
              Risk % per Trade
            </label>
            <input
              type="number"
              value={riskPercent}
              onChange={(e) => setRiskPercent(e.target.value)}
              style={{ MozAppearance: "textfield" }}
              onWheel={handleWheel}
              className="dark:placeholder-white placeholder-black-dark-400 w-full rounded bg-transparent border-[1.2px] border-gray-500 px-5 py-3 font-normal text-black-dark-400 dark:text-whiten outline-none transition focus:border-main_color active:border-main_color disabled:cursor-default disabled:bg-gray dark:disabled:bg-slate-600 disabled:border-none dark:focus:border-main_color"
            />
          </div>

          <div className="mb-4.5 text-black-dark-400 dark:text-whiten w-full">
            <label className="mb-3 block text-sm font-semibold text-black-dark-400 dark:text-whiten">
              Entry Price
            </label>

            <input
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              style={{ MozAppearance: "textfield" }}
              onWheel={handleWheel}
              className="dark:placeholder-white placeholder-black-dark-400 w-full rounded bg-transparent border-[1.2px] border-gray-500 px-5 py-3 font-normal text-black-dark-400 dark:text-whiten outline-none transition focus:border-main_color active:border-main_color disabled:cursor-default disabled:bg-gray dark:disabled:bg-slate-600 disabled:border-none dark:focus:border-main_color"
            />
          </div>

          <div className="mb-4.5 text-black-dark-400 dark:text-whiten w-full">
            <label className="mb-3 block text-sm font-semibold text-black-dark-400 dark:text-whiten">
              Target Price
            </label>

            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              style={{ MozAppearance: "textfield" }}
              onWheel={handleWheel}
              className="dark:placeholder-white placeholder-black-dark-400 w-full rounded bg-transparent border-[1.2px] border-gray-500 px-5 py-3 font-normal text-black-dark-400 dark:text-whiten outline-none transition focus:border-main_color active:border-main_color disabled:cursor-default disabled:bg-gray dark:disabled:bg-slate-600 disabled:border-none dark:focus:border-main_color"
            />
          </div>

          <div className="mb-4.5 text-black-dark-400 dark:text-whiten w-full">
            <label className="mb-3 block text-sm font-semibold text-black-dark-400 dark:text-whiten">
              Stop Loss Price
            </label>

            <input
              type="number"
              value={stopLossPrice}
              onChange={(e) => setStopLossPrice(e.target.value)}
              style={{ MozAppearance: "textfield" }}
              onWheel={handleWheel}
              className="dark:placeholder-white placeholder-black-dark-400 w-full rounded bg-transparent border-[1.2px] border-gray-500 px-5 py-3 font-normal text-black-dark-400 dark:text-whiten outline-none transition focus:border-main_color active:border-main_color disabled:cursor-default disabled:bg-gray dark:disabled:bg-slate-600 disabled:border-none dark:focus:border-main_color"
            />
          </div>
        </div>

        {accountSize && (
          <div
            className={`mt-4 p-8 border-2 ${
              riskPercent &&
              accountSize &&
              entryPrice &&
              stopLossPrice &&
              targetPrice
                ? "border-secondary"
                : "border-primary"
            } rounded-md text-center`}
          >
            <h2 className="text-lg p-2">
              <strong>Risk Amount:</strong> ₹{riskAmount.toFixed(2)}
            </h2>
            <h2 className="text-lg p-2">
              <strong>Position Size:</strong> {positionSize} Shares
            </h2>
            <h2 className="text-lg p-2">
              <strong>Risk-Reward Ratio:</strong> {riskRewardRatio} : 1
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskManagementCalculator;
