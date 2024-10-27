import React from "react";

function Card({ value, heading }) {
  return (
    <div className="relative flex flex-col min-w-0 mb-6 break-words border-[0.6px] border-gray-500 shadow-soft-xl rounded-sm bg-clip-border">
      <div className="flex-auto p-5">
        <div className="flex flex-wrap -mx-3">
          <div className="flex-none max-w-full px-3 h-20 sm:h-22">
            <div className="mt-2">
              <p className="mb-4 font-sans font-semibold leading-normal text-md text-black-dark-200 dark:text-whiten">
                {heading}
              </p>
              <h5 className="mb-0 font-bold text-main_color mt-1 text-xl">
                {value}
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
