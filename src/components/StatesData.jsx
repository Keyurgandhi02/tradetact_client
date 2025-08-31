import React from "react";
import StateDataHighlightCard from "./StateDataHighlightCard";

function StatesData({ highlightCardData, unit }) {
  return (
    <section className="p-8 rounded-md">
      <StateDataHighlightCard
        highlightCardData={highlightCardData}
        unit={unit}
      />
      <div className="flex flex-col lg:flex-row gap-5 mt-8">
        <div className="w-full lg:w-1/4">
          <OtherDataCardHeading heading="Lowest" />
          <OtherDataCardDetails title="" value={highlightCardData?.lowest} />
        </div>
        <div className="w-full lg:w-1/4">
          <OtherDataCardHeading heading="Highest" />
          <OtherDataCardDetails title="" value={highlightCardData?.highest} />
        </div>
        <div className="w-full lg:w-1/4">
          <OtherDataCardHeading heading="Next Quarter" />
          <OtherDataCardDetails title="" value={highlightCardData?.next_1} />
        </div>
        <div className="w-full lg:w-1/4">
          <OtherDataCardHeading heading="Next Year" />
          <OtherDataCardDetails title="" value={highlightCardData?.next_2} />
        </div>
      </div>
    </section>
  );
}

export default StatesData;

export const OtherDataCardHeading = ({ heading }) => {
  return (
    <div className="p-2 font-semibold text-center dark:text-whiten text-black-dark-300 ">
      {heading}
    </div>
  );
};

export const OtherDataCardDetails = ({ value }) => {
  return (
    <div
      className={`border ${
        value > 0 ? "border-main_color" : "border-main_red_color"
      } rounded-md text-center py-8 mt-2`}
    >
      <h2
        className={`text-3xl font-bold ${
          value > 0 ? "text-main_color" : "text-main_red_color"
        }`}
      >
        {value}
      </h2>
    </div>
  );
};
