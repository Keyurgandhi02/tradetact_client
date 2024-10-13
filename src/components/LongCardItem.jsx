import React from "react";
import { parseCurrencyToNumber } from "../config/helper";

function LongCardItem({ heading, value, isAmount, dvalue }) {
  const parsedValue = parseCurrencyToNumber(dvalue);

  return (
    <div className="flex flex-col items-center border-b border-black-dark-300 last:border-none sm:border-none pb-4 sm:pb-0 w-full sm:w-42 h-auto sm:h-18 truncate">
      <p className=" dark:text-whiten text-black-dark-300 text-sm mb-3 font-semibold">
        {heading}
      </p>
      <p
        className={`${
          isAmount
            ? parsedValue > 0
              ? "text-main_color"
              : "text-main_red_color"
            : "dark:text-white text-black-dark-400"
        } text-md font-bold`}
      >
        {dvalue ? dvalue : value}
      </p>
    </div>
  );
}

export default LongCardItem;
