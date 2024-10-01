import React from "react";

function StatesDataSummary({
  gdpData,
  labourData,
  priceData,
  moneyData,
  priceData1,
}) {
  return (
    <section class="antialiased dark:bg-gray-900">
      <div class="mt-6 sm:mt-8">
        <div class="relative overflow-x-auto">
          <table class="w-full md:table-fixed">
            <tbody>
              <StatesDataItem
                title="GDP Growth"
                value={gdpData?.current}
                summary="GDP Growth Rate has been declined as compare previous but growth remain constant upcoming years"
                unit="%"
              />
              <StatesDataItem
                title="Unemployment"
                value={labourData?.current}
                summary="NA"
                unit="%"
              />
              <StatesDataItem
                title="Interest Rate"
                value={moneyData?.current}
                summary="NA"
                unit="%"
              />
              <StatesDataItem
                title="Inflation"
                value={priceData1?.current}
                summary="NA"
                unit="%"
              />
              <StatesDataItem
                title="CPI"
                value={priceData?.current}
                summary="NA"
                unit="points"
              />
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default StatesDataSummary;

const StatesDataItem = ({ title, value, summary, unit }) => {
  return (
    <tr className="border border-primary">
      <td className="whitespace-nowrap py-7 px-3 md:w-[384px]">
        <div className="flex items-center gap-4">
          <span className="text-primary-200 font-bold">{title}</span>
        </div>
      </td>

      <td className="p-4 text-base font-bold text-primary-200">
        {value} {unit}
      </td>

      <td className="p-4 text-left text-base font-bold text-primary-200">
        {summary}
      </td>
    </tr>
  );
};
