import React from "react";

function LongCard({ title, children }) {
  return (
    <div className="mx-4 my-8 border border-whiten rounded-xl bg-black-dark-200 p-6 shadow-lg sm:mx-auto sm:max-w-full md:max-w-full lg:max-w-full">
      <div className="flex flex-col gap-y-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-primary-300 text-lg font-bold">{title}</p>
      </div>
      <div className="mt-2 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:justify-around">
        {children}
      </div>
    </div>
  );
}

export default LongCard;
