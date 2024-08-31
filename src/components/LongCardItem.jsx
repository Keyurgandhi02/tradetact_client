import React from "react";

function LongCardItem({ heading, value }) {
  return (
    <div className="flex flex-col items-center border-b border-black-dark-300 last:border-none sm:border-none pb-4 sm:pb-0">
      <p className="text-primary-300 text-md mb-3 font-bold">{heading}</p>
      <p className="text-whiten mb-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

export default LongCardItem;
